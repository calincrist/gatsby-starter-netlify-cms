import React from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

function SEO({ description, meta, metaImage, title }) {

  // console.log({metaImage: metaImage});

  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              author
              description
              siteURL
              keywords
            }
          }
        }
      `}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description;
        const image =
          metaImage && metaImage.src
            ? `${data.site.siteMetadata.siteURL}${metaImage.src}`
            : null;
        return (
          <Helmet
            htmlAttributes={{
              lang: "en"
            }}
            title={title}
            meta={
              [
                {
                  name: "description",
                  content: metaDescription
                },
                {
                  name: "keywords",
                  content: data.site.siteMetadata.keywords
                },
                {
                  property: "og:title",
                  content: title
                },
                {
                  property: "og:description",
                  content: metaDescription
                },
                {
                  name: "twitter:creator",
                  content: data.site.siteMetadata.twitterAuthor
                },
                {
                  name: "twitter:title",
                  content: title
                },
                {
                  name: "twitter:description",
                  content: metaDescription
                }
              ]
                .concat(
                  metaImage
                    ? [
                        {
                          property: "og:image",
                          content: image
                        },
                        {
                          property: "og:image:width",
                          content: metaImage.width
                        },
                        {
                          property: "og:image:height",
                          content: metaImage.height
                        },
                        {
                          name: "twitter:card",
                          content: "summary_large_image"
                        }
                      ]
                    : [
                        {
                          name: "twitter:card",
                          content: "summary"
                        }
                      ]
                )
                .concat(meta)
            }
          />
        );
      }}
    />
  );
}

SEO.defaultProps = {
  meta: []
};

SEO.propTypes = {
  description: PropTypes.string,
  metaImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    // height: PropTypes.string.isRequired(),
    // width: PropTypes.string.isRequired()
  }),
  meta: PropTypes.array,
  title: PropTypes.string.isRequired
};

export default SEO;