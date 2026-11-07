export default function ArticleContent({ html }: { html: string }) {
    if (!html) return null;
    return <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
