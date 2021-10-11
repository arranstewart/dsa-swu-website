// .eleventy.js in the project root

const isProduction = process.env.ELEVENTY_ENV === 'production';

//const nunjucks = require('nunjucks');
const yaml = require("js-yaml");
 const fs          = require('fs');
// nice formatting of dates and times
// (deprecated, but still works)
const moment      = require('moment');
moment.locale('en-GB');

module.exports = function(eleventyConfig) {
  // Customizations go here

  console.log("whether using production env:", isProduction);

  ////
  // markdown-it package and plugins

  let markdownIt          = require("markdown-it");
  // Allow classes, identifiers and attributes in braces
  // e.g. {.class #identifier attr=value attr2="spaced value"}
  let markdownItAttrs     = require("markdown-it-attrs");
  let markdownItAnchor    = require("markdown-it-anchor");
  //let markdownItHeadings  = require("markdown-it-github-headings");
  let markdownItDefList   = require('markdown-it-deflist');
  let markdownItDiv       = require('markdown-it-div');
  let markdownItDocutils  = require("markdown-it-docutils").docutilsPlugin;
  let markdownItFancyList = require("markdown-it-fancy-lists").markdownItFancyListPlugin;
  let markdownItFootnotes = require('markdown-it-footnote');
  let markdownItHtml      = require('markdown-it-html'); // allow html escape

  let options = {
    html: true,        // Enable HTML tags in source
    linkify: true,     // autoconvert URL-like text to links
    typographer: true  // quote beautification
  };

  let markdownLib = markdownIt(options)
                      .use(markdownItAttrs)
                      .use(markdownItAnchor,
                           {
                             permalink: markdownItAnchor.permalink.linkInsideHeader({
                               space: false,
                               style: 'visually-hidden',
                               symbol: '🔗',
                               assistiveText: title => `Permalink to “${title}”`,
                               visuallyHiddenClass: 'visually-hidden'
                             })
                           }
                         );

  eleventyConfig.setLibrary("md", markdownLib);

  ////
  // Allow YAML data files

  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  ////
  // date filter (used e.g. in sitemap)

  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  ////
  // Copy over assets

  copy_config = {};

  // This will copy these folders to the output without modifying them at all
  // (NB: these won't get mininified, linted, etc. TODO: minify and lint them)
  var asset_dirs = ['css', 'fonts', 'images', 'js', 'lectures', 'code', 'problem-sheets'];

  for (const dir of asset_dirs) {
    const src_dir = "/assets/" + dir;
    if (! fs.existsSync(src_dir) ) {
      console.log("warning: assets dir " + src_dir + " does not exist");
    }
    const dst_dir = dir;
    console.log("adding " + src_dir + ", dst " + dst_dir);
    copy_config[src_dir] = dst_dir;
  }

  eleventyConfig.addPassthroughCopy( copy_config );

  ////
  // post-processing:
  // - validate HTML using html tidy
  // - do markdown header navigation/permalinks
  const execa = require('execa');

  // if wanting to do postprocessing on the
  // output (e.g. adding links/anchors next to headers)
  // add them below in the spot indicated.
  //
  // We also run `tidy` to check for errors: the
  // build will fail if the HTML produced can't be parsed.

  eleventyConfig.addTransform("headernav", function(content, outputPath) {
    console.log("\nheadernav. outputPath:", outputPath);

    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( this.outputPath && this.outputPath.endsWith(".html") ) {
      let outputPath = this.outputPath;
      console.log("executing 'tidy'");
      try {
        execa.commandSync('tidy -q -e -utf8', {
          timeout: 1000 * 4,
          input: content
      });
      } catch (err) {
        if (err.exitCode && err.exitCode == 0) {
          console.log("tidy: " + outputPath + " OK");
        } else if (err.exitCode && err.exitCode == 1) {
          console.log("tidy: " + outputPath + " produced warnings:", err.shortMessage);
          console.log("stderr was: ", err.stderr);
        } else {
          console.log("\n\nfailed running tidy on", outputPath, err.shortMessage );
          console.log("content start was: ",  content.substring(0, 100) );
          throw new Error('failed running tidy on ' + outputPath + ", " + err.toString(), { cause: err });
        }
      }

      const {parse, HTMLElement, TextNode}
                        = require('node-html-parser');
      const root        = parse(content, {
                            comment: true,
                            blockTextElements: {
                              script: true,
                              noscript: true,
                              style: true,
                              pre: true
                            }
                          });

      // TRANSFORMS HAPPEN HERE

      var h2_els        = root.querySelectorAll(".content h2");
      console.log(outputPath + " number .content/h2 els:", h2_els.length);

      for (var i = 0, h2; h2 = h2_els[i]; i++) {
        let h2_id = h2.id;
        var old_h2 = h2.innerHTML
        h2.innerHTML = '';
        const new_link = new HTMLElement('a', {}, `href='#${h2_id}'`);
        //console.log("adding new link", new_link);
        new_link.appendChild( new TextNode(old_h2) );
        h2.appendChild(new_link);
      }

      return root.toString();
    } else {
      return content;
    }
  })

  ////
  // eleventy options

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: "/src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "/out/_site/"
    },
    // use nunjucks for everything:
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    // use this to shift base url if
    // deploying to somewhere below root (/)
    pathPrefix: isProduction ? '/units/DSA-SWU/' : '/'
  };
}

