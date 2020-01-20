import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"
import SEO from "../components/SEO";

import Navbar from '../components/Navbar'
import './all.sass'

import staticOGImage from '../../static/img/og-image.png'

const TemplateWrapper = ({ children }) => {

  console.log(staticOGImage);
  const imageObj = { src: staticOGImage };

  return (<StaticQuery
    query={graphql`
      query HeadingQuery {
          site {
            siteMetadata {
              title
              description
              author
              siteURL
              # siteVerification {
              #   google
              #   bing
              # }
              twitterAuthor
              socialLinks {
                twitter
                linkedin
                github
                email
              }
              keywords
            }
          }
        }
    `}
    render={data => (
      <div>
        <Helmet>
          <html lang="en" />
          <title>{data.site.siteMetadata.title}</title>
          <meta name="description" content={data.site.siteMetadata.description} />
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900" rel="stylesheet"></link>
          <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
	        <link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32" />
	        <link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16" />
	
	        <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#ff4400" />
	        <meta name="theme-color" content="#fff" />

	        <meta property="og:type" content="website" />
          <meta property="og:title" content={data.site.siteMetadata.title} />
          <meta property="og:author" content={data.site.siteMetadata.author} />
          <meta name="twitter:creator" content={data.site.siteMetadata.twitterAuthor} />
          <meta property="og:url" content="/" />
          <meta property="og:image" content={staticOGImage} />
          
          <SEO title={data.site.siteMetadata.title} /> 
        </Helmet>
        <Navbar />
        <div>{children}</div>
      </div>
    )}
  />);
}

export default TemplateWrapper
