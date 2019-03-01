import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import { SocialIcon } from "react-social-icons";
import profileImage from "../img/fotoram.io.png"

export const AboutPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                {title}
              </h2>
              <div class="columns">
                <div class="column is-one-quarter">
                  <img src={profileImage} alt="Logo" />
                  <SocialIcon target="_blank" class="social-icon" url="https://www.upwork.com/o/profiles/users/_~0166257bb58306374f/" />
                  <SocialIcon target="_blank"  class="social-icon"  url="https://www.linkedin.com/in/calin-cristian-ciubotariu-9a653699" />
                  <SocialIcon target="_blank"  class="social-icon"  url="https://twitter.com/calin_crist" />
                  <SocialIcon target="_blank"  class="social-icon"  url="https://www.facebook.com/calin.crist" /> 
                </div>
                <div class="column">
                  <PageContent className="content" content={content} />
                </div>
              </div>
              <br/>
              
              <br/>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
