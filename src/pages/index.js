import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
        <section className="section">
          <div className="container">
            {/* <div className="content">
              <h1 className="has-text-weight-bold is-size-2 page-title">Blog</h1>
            </div> */}
            {posts
              .map(({ node: post }) => (
                <div
                  className="content"
                  style={{ padding: '2em 4em' }}
                  key={post.id}
                >
                  <p>
                    <Link className="blog-post-title" to={post.fields.slug}>
                      {post.frontmatter.title}
                    </Link>
                  </p>
                  <p>
                    <Link className="blog-post-excerpt" to={post.fields.slug}>
                      {post.excerpt}
                    </Link>
                    <br />
                    <br />
                    <small>{post.frontmatter.date.toUpperCase()}</small>
                  </p>
                  <hr className="divider"/>
                </div>
              ))}
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "blog-post" } }}
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "DD MMMM YYYY")
          }
        }
      }
    }
  }
`
