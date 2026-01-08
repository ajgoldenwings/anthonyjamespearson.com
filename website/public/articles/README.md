# Adding Articles

Articles are stored as markdown files here—`website/public/articles/`. To add a new article:

1. Create a new `.md` file with the naming convention: `YYYY-MM-DD_Article-Title.md`
2. Add the article metadata to the articles list in `website/src/app/pages/articles/articles.ts`
3. The article will automatically be available at `/articles/YYYY-MM-DD_Article-Title`
4. The first line is the title of the page. i.e. `# Creating Your First Website With IIS`
