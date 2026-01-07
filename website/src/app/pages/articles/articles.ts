import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Article {
  id: string;
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.html',
  imports: [
    MarkdownModule,
    RouterLink,
    CommonModule
  ],
})
export class Articles {
  articles: Article[] = [
    {
      id: '2018-05-20_Membership-Role-Policy-Based-Authorization-in-ASP-NET-Core',
      title: 'Membership Role Policy-Based Authorization in ASP.NET Core',
      date: '2018-05-20',
      description: 'Want to create a policy based authorize attribute for your website? Look here for an example how I separate privileges out based on roles per organizations.'
    },
    {
      id: '2018-03-04_Learning-More-React-by-Creating-a-Madlib',
      title: 'Learning More React by Creating a Madlib',
      date: '2018-03-04',
      description: 'Created a Madlib. In React. And it is funny. Come take a gander at the post to see the Code and Madlib.'
    },
    {
      id: '2017-12-17_How-to-Create-an-Event-Firebase-and-React-Single-Page-Web-App-Day0',
      title: 'How to Create an Event Firebase and React Single Page Web App: Day 0',
      date: '2017-12-17',
      description: 'Learn how to create a single page application using React as a front end and Firebase as your backend. We will start with initializing your project.'
    },
    {
      id: '2017-11-25_My-Reactions-to-React',
      title: 'My Reactions to React',
      date: '2017-11-25',
      description: 'Anthony learns React. Well just breezing through it, looking over the documentation and going through the Tic-Tac-Toe tutorial with thoughts and comparisons.'
    },
    {
      id: '2017-10-21_Building-a-Site-with-Markdown-Document-Pages-and-Polymer',
      title: 'Building a Site with Markdown Document Pages and Polymer',
      date: '2017-10-21',
      description: 'Learn how to use Markdown in your own webpage. Also, a few hints of how to build out a site with multiple or dynamic pages with Markdown.'
    },
    {
      id: '2017-10-15_A-Blog-Is-Reborn',
      title: 'A Blog Is Reborn',
      date: '2017-10-15',
      description: 'A quick introduction of what I changed in the site and what my plans for the future.'
    },
    {
      id: '2016-06-25_Dynamically-Loading-Pages-From-Navigation-Links',
      title: 'Dynamically Loading Pages From Navigation Links',
      date: '2016-06-25',
      description: 'So you have multiple pages in your website and you want to find a way to dynamically load content on your page without duplicating your menu or footer. Also, you might be interested in looking at one implementation of doing this with jQuery.'
    },
    {
      id: '2016-05-23_Start-Server-Instance-With-EC2',
      title: 'Start Server Instance With EC2',
      date: '2016-05-23',
      description: 'This is the first part if you want to create your own backend or really anything that needs processing. Later on we will be looking at CloudFront that will help us with the instance.'
    },
    {
      id: '2016-05-18_Register-Domain-With-Route-52-and-Direct-it-to-S3',
      title: 'Register Domain With Route 52 and Direct it to S3',
      date: '2016-05-18',
      description: 'I bet you have been wanting your own website. This will show ya. I hope you can do it. This will show what it takes to get a domain and call it yours. Good luck you guys and girls.'
    },
    {
      id: '2016-05-16_Upload-Site-to-S3',
      title: 'Upload Site to S3',
      date: '2016-05-16',
      description: 'Upload your site here and actually see it up on the web. We will not make a custom domain name in this one. Next post will be. Just you wait, but look at this one first. Oh, look at the one before if you did not read it unless your smart at signing in into things.'
    },
    {
      id: '2016-05-15_Creating-an-AWS-Account',
      title: 'Creating an AWS Account',
      date: '2016-05-15',
      description: 'You created a website? Great! But now what? Are you ready to put it online? Where do you start? Well this may be a option for you to begin with if you continue on the next posts.'
    },
    {
      id: '2016-05-14_Creating-Your-First-Website-With-IIS',
      title: 'Creating Your First Website With IIS',
      date: '2016-05-14',
      description: 'You may be wanting to make a site but has no idea where to start. So lets just start and create your first website through IIS. Some recommendations too!'
    }
  ];
}
