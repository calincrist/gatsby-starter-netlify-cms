import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"
import SEO from "./SEO";
import Sidebar from "./Sidebar";

import Navbar from '../components/Navbar'
import './all.sass'

const TemplateWrapper = ({ children }) => {

  const imageObj = { src: '/img/og-image.png' };

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
          <meta property="og:description" content={data.site.siteMetadata.description} />
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
          <meta property="og:url" content={data.site.siteMetadata.siteURL} />
          <meta property="og:image" content={`${data.site.siteMetadata.siteURL}/img/og-image.png`} />
          
          <SEO title={data.site.siteMetadata.title} metaImage={imageObj} /> 
        </Helmet>
        {/* <Navbar /> */}
        <div className="columns">
          <div className="column is-2">
            <Sidebar/>
          </div>
          {children}
        </div>
      </div>
    )}
  />);
}

export default TemplateWrapper
