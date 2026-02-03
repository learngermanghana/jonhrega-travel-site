import Container from "./Container";
import { blogPosts } from "../data/blogPosts";

export default function BlogHighlights() {
  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Travel Tips & Insights</h2>
          <p>Short guides to help you plan better trips, applications, and itineraries.</p>
        </div>
        <div className="blogGrid">
          {blogPosts.map((post) => (
            <article className="blogCard" key={post.slug}>
              <div className="blogCard__meta">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="blogCard__title">{post.title}</h3>
              <p className="blogCard__text">{post.excerpt}</p>
              <div className="blogCard__cta">Coming soon</div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
