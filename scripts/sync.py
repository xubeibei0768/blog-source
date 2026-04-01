import os
from datetime import datetime
from notion_client import Client
from notion2md.exporter.block import StringExporter

# 1. 挂载环境变量
NOTION_TOKEN = os.environ.get("NOTION_TOKEN")
DATABASE_ID = os.environ.get("NOTION_DATABASE_ID")

if not NOTION_TOKEN or not DATABASE_ID:
    raise ValueError("环境变量缺失！请检查 GitHub Secrets 配置。")

notion = Client(auth=NOTION_TOKEN)

def sync_articles():
    print("🤖 正在连接 Notion 数据库...")
    # 2. 核心过滤器：严密狙击 "Post" + "Published"
    query = notion.databases.query(
        database_id=DATABASE_ID,
        filter={
            "and": [
                {"property": "status", "select": {"equals": "Published"}},
                {"property": "type", "select": {"equals": "Post"}}
            ]
        }
    )
    pages = query.get("results", [])
    print(f"📦 发现 {len(pages)} 篇准备发布的文章。")

    # 确保保存文章的目录存在
    os.makedirs("source/_posts", exist_ok=True)

    for page in pages:
        props = page["properties"]
        page_id = page["id"]
        
        # 3. 优雅解析属性 (带异常容错)
        try:
            title = props["title"]["title"][0]["plain_text"]
            
            # 处理日期 (如果没有手动选日期，就用最后编辑时间)
            date_str = props["date"]["date"]["start"] if props.get("date") and props["date"]["date"] else page["last_edited_time"]
            date_formatted = datetime.fromisoformat(date_str.replace('Z', '+00:00')).strftime("%Y-%m-%d %H:%M:%S")
            
            # 处理分类和标签
            category = props["category"]["select"]["name"] if props.get("category") and props["category"]["select"] else "Uncategorized"
            tags = [t["name"] for t in props["tags"]["multi_select"]] if props.get("tags") else []
            tags_str = "\n".join([f"  - {t}" for t in tags])
            
        except IndexError as e:
            print(f"⚠️ 页面属性不完整，跳过: {page_id}")
            continue

        print(f"⏳ 正在转换: 《{title}》...")
        
        # 4. 将 Notion Block 原生转为 Markdown
        md_content = StringExporter(block_id=page_id, client=notion).export()
        
        # 5. 拼装 Hexo 的 Front-matter
        front_matter = f"---\ntitle: {title}\ndate: {date_formatted}\ncategories:\n  - {category}\n"
        if tags:
            front_matter += f"tags:\n{tags_str}\n"
        front_matter += "---\n\n"
        
        # 6. 写入本地文件
        safe_title = title.replace("/", "-").replace(":", "-") # 防止标题有特殊字符导致建文件失败
        file_path = f"source/_posts/{safe_title}.md"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(front_matter + md_content)
            
    print("✅ 所有文章同步完成！")

if __name__ == "__main__":
    sync_articles()