module.exports = {
  siteMetadata: {
    title: 'Calin\'s personal space on the internet',
    description: 'Calin\'s personal space on the internet',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Your Site's RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/",
            // optional configuration to specify external rss feed, such as feedburner
            link: "https://feeds.feedburner.com/gatsby/blog",
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            }
          }
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve:'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
      options: {
        develop: true,            // Activates purging in npm run develop
        purgeOnly: ['/all.sass'], // applies purging only on the bulma css file
      },
    }, // must be after other CSS plugins
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [{
          resolve: `gatsby-remark-vscode`,
          // All options are optional. Defaults shown here.
          options: {
            colorTheme: 'Light+ (default light)', // Read on for list of included themes. Also accepts object and function forms.
            wrapperClassName: '',   // Additional class put on 'pre' tag. Also accepts function to set the class dynamically.
            injectStyles: true,     // Injects (minimal) additional CSS for layout and scrolling
            extensions: [],         // Extensions to download from the marketplace to provide more languages and themes
            // extensionDataDirectory: // Absolute path to the directory where extensions will be downloaded. Defaults to inside node_modules.
              // path.resolve('extensions'),
            languageAliases: {},    // Map of custom/unknown language codes to standard/known language codes
            replaceColor: x => x,   // Function allowing replacement of a theme color with another. Useful for replacing hex colors with CSS variables.
            getLineClassName: ({    // Function allowing dynamic setting of additional class names on individual lines
              content,              //   - the string content of the line
              index,                //   - the zero-based index of the line within the code fence
              language,             //   - the language specified for the code fence
              codeFenceOptions      //   - any options set on the code fence alongside the language (more on this later)
            }) => '',
            logLevel: 'error'       // Set to 'warn' to debug if something looks wrong
          }
        }]
      },
    },
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
