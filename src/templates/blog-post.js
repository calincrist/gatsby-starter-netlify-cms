import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Image from 'gatsby-image'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import SEO from '../components/SEO';
import '../components/all.sass'

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  publishDate,
  tags,
  title,
  featured_image,
  helmet,
}) => {
  const PostContent = contentComponent || Content

  console.log(featured_image);

  return (
    <section className="section">
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2">
              {title}
            </h1>
            {featured_image ? <img key={featured_image} alt={title} src={featured_image}/> : null}
            <small className="publish-date" style={{color: '#A5B1B8'}}>{publishDate ? publishDate.toUpperCase() : "-"}</small>
        
            <br />
            <br />
            
            <p>{description}</p>

            <br />
            
            <PostContent className="blog-post-content" content={content} />
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map(tag => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post, site } = data

  console.log(site.siteMetadata.siteUrl)
  console.log(post.frontmatter.featured_image)
  console.log(`${site.siteMetadata.siteUrl}/${post.frontmatter.featured_image}`)

  return (
    <Layout>
      <SEO 
        title={post.frontmatter.title} 
        description={post.frontmatter.description} 
        image={`${site.siteMetadata.siteUrl}/${post.frontmatter.featured_image}`}/>

      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        publishDate={post.frontmatter.date}
        featured_image={`${site.siteMetadata.siteUrl}/${post.frontmatter.featured_image}`}
        helmet={
          <Helmet
            titleTemplate="%s | Blog"
          >
            <title>{`${post.frontmatter.title}`}</title>
            <meta name="description" content={`${post.frontmatter.description}`} />
            <meta property="og:image" content={`${site.siteMetadata.siteUrl}/${post.frontmatter.featured_image}`} />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
        site_url: siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "DD MMMM YYYY")
        title
        description
        tags
        featured_image 
        # {
        #   childImageSharp {
        #     fluid(maxWidth: 630) {
        #       ...GatsbyImageSharpFluid_noBase64
        #     }
        #   }
        # }
      }
    }
  }
`
