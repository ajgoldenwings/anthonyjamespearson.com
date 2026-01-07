# Anthony James Pearson - Personal Website

My personal website built with Angular and AWS CDK, featuring a blog with markdown articles and server-side rendering.

## Features

- **Modern Angular Frontend** - Built with Angular 21 and standalone components
- **Markdown Blog System** - Dynamic article rendering from markdown files
- **Server-Side Rendering** - Optimized for SEO and performance
- **Responsive Design** - Built with DaisyUI and Tailwind CSS
- **AWS Infrastructure** - Deployed using AWS CDK for scalable hosting

## Project Structure

```
├── website/          # Angular frontend application
├── infrastructure/   # AWS CDK infrastructure code
└── README.md         # This file
```

## 🛠️ Development

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajgoldenwings/anthonyjamespearson.com.git
   cd anthonyjamespearson.com
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install website dependencies
   cd website
   npm install
   ```

3. **Start development server**
   ```bash
   npm run start
   ```
   
Navigate to `http://localhost:4200/` to view the website.

### Adding Articles

Articles are stored as markdown files in `website/public/articles/`. To add a new article:

1. Create a new `.md` file with the naming convention: `YYYY-MM-DD_Article-Title.md`
2. Add the article metadata to the articles list in `website/src/app/pages/articles/articles.ts`
3. The article will automatically be available at `/articles/YYYY-MM-DD_Article-Title`

## 🏗️ Infrastructure

The infrastructure is managed using AWS CDK and includes:

- S3 bucket for static hosting
- CloudFront distribution for global CDN
- Route 53 for DNS management
- SSL certificate for HTTPS

### Deploy Infrastructure

```bash
npm run synth
npm run diff
npm run deploy
```

## Technologies Used

- **Frontend**: Angular 21, TypeScript, DaisyUI, Tailwind CSS
- **Markdown**: ngx-markdown for article rendering
- **Infrastructure**: AWS CDK, TypeScript
- **Hosting**: AWS S3, CloudFront, Route 53

## License

This project is personal and proprietary. Please feel free to reach out to for any correspondence.

## Author

**Anthony James Pearson**
- Website: [anthonyjamespearson.com](https://anthonyjamespearson.com)
- GitHub: [@ajgoldenwings](https://github.com/ajgoldenwings)