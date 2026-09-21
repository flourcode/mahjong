MAHJONGCENTER.COM - HOW THIS WEBSITE WORKS
==========================================

This folder is the complete website. It is plain HTML, CSS and JavaScript.
There is nothing to install, compile or build.

------------------------------------------------------------
1. DEPLOY (GitHub + AWS Amplify)
------------------------------------------------------------
1. Create a GitHub repository and upload EVERYTHING in this folder
   (index.html must be at the top level of the repository, not inside a subfolder).
2. In AWS Amplify, choose "Host web app", connect the repository and branch.
3. When Amplify asks about build settings, leave the build command empty.
   The "output directory" / base directory is the repository root ( / ).
4. Deploy. Then connect your domain mahjongcenter.com under "Domain management".
5. Custom 404 page: in Amplify, open "Rewrites and redirects" and add:
      Source address:  /<*>
      Target address:  /404.html
      Type:            404 (Rewrite)
6. After the site is live, add it to Google Search Console and submit:
      https://mahjongcenter.com/sitemap.xml

Note: links use paths like /rules/joker-rules/. They work on the live site.
If you double-click an HTML file on your computer, styles will look broken.
That is normal. Preview on Amplify instead.

------------------------------------------------------------
2. PLACEHOLDERS YOU MUST FILL IN
------------------------------------------------------------
Search all files for these and replace them:
  [CONTACT EMAIL]     contact/, privacy/, terms/
  [SITE OWNER NAME]   privacy/, terms/
  [JURISDICTION]      terms/

Search for "VERIFY CURRENT INFO" (HTML comments) before each update of:
  community/play-american-mahjong-online/
  community/find-local-mahjong/
  gear/best-american-mahjong-sets/
  gear/best-mahjong-mats/
These mark product, platform and price claims that change over time.

------------------------------------------------------------
3. THINGS TO ADD LATER (search for these comments)
------------------------------------------------------------
  <!-- ADSENSE SITE VERIFICATION / AUTO ADS CODE GOES HERE AFTER ACCOUNT SETUP -->
      In the <head> of every page. Paste Google's code here once you have it.
      Then create /ads.txt using the exact line Google gives you.
  <!-- GOOGLE CONSENT MANAGEMENT PLATFORM (CMP) CODE GOES HERE ... -->
      Needed for visitors in the EEA/UK/Switzerland once ads are on.
      Use Google's own CMP or another Google-certified CMP.
  <!-- GOOGLE ANALYTICS CODE GOES HERE IF ENABLED -->
  <!-- REPLACE WITH FINAL SOCIAL SHARE IMAGE -->
      Currently /assets/images/og-default.png (1200 x 630).
  <!-- AFFILIATE LINK GOES HERE AFTER APPROVAL -->
      On gear pages. Each contains a ready-made button to uncomment.
      Keep rel="sponsored noopener" on affiliate links.

Every page's <head> is the same apart from title, description and URLs, so
when you paste AdSense or Analytics code, paste it into every .html file
(a "find and replace in files" in VS Code does this in one step).

------------------------------------------------------------
4. FILE MAP
------------------------------------------------------------
  index.html                 Homepage
  404.html                   "Page not found"
  robots.txt, sitemap.xml    For search engines
  assets/css/styles.css      All styling (one file). Colors are at the top.
  assets/js/main.js          Mobile menu
  assets/js/search.js        Search logic
  assets/js/search-index.js  List of pages that search can find
  assets/js/flower-match.js  The Flower Match game (flowers are drawn in code)
  assets/images/             Favicon, logo, social share image
  learn/ rules/ strategy/ gear/ community/ play/   Guides
  about/ contact/ editorial-policy/ privacy/ terms/ affiliate-disclosure/
  search/                    Search page (not indexed by Google)

------------------------------------------------------------
5. ADDING A NEW ARTICLE
------------------------------------------------------------
1. Copy an existing article folder, e.g. rules/dead-hand/, and rename it.
2. In the new index.html, update: <title>, meta description, canonical URL,
   og:title, og:description, og:url, the two JSON-LD blocks, breadcrumb,
   H1, standfirst and body.
3. Add the URL to sitemap.xml.
4. Add an entry to assets/js/search-index.js.
5. Link to it from its section page (e.g. rules/index.html) and from 1-2
   related articles.
