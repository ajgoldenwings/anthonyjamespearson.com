# How to Create an Event Firebase and React Single Page Web App: Day 0

## Introduction to the Series
First off, welcome to my site and the first of this series. I believe that if you are looking at this, you are somebody who may be new to web development or who knows a few things but just doesn't know how to string everything together. If you are looking to build a single page web application from scratch, you're in the right place. We will start with setting up the basics and then begin adding a list of things that every app needs. What are these?

They are:

* A Single Page (Single Page Application)
* An Asynchronous List (Event List)
* Authentication (Administer your Events and Not Others)
* Get a Domain for your App
* Access to the Camera Media Device
* Access to the GPS Media Device
* Item Associations (Who is Going to What Event)

## Introduction to Day 0
You will be surprised by how fast it is to develop a solution locally and deploy it to a hosting site. This should be as basic as possible just to get something running but expandable for the next parts of this series.

It helps to know a few things about the web or a framework in JavaScript, but I know that everyone doesn't know everything. So I may be a little verbose.

If you have not installed <a href="https://nodejs.org/en/" target="_blank">Node.js</a>, please do so now.

This will help with installing React, getting important components, and deployment.

## Setting up Firebase
The best reason to use Firebase is that it is extremely scalable with many built-in tools. Getting something started is super simple and also **Free**! So go to <a href="https://firebase.google.com/" target="_blank">Firebase</a> and sign up.

Be sure to check the pricing if you are interested in making an expanded application.

Please sign in and add a new project. I am calling mine 'My Events', but you may give it a different name. If you do, be aware you may need to make a couple of changes here and there due to the name change.

![](/images/ReactFirebase_Day0_00.png "Add Project")

Once created, you should be brought to your control panel for managing your backend.

## Setting up React
Now pull up your preferred terminal to enter some npm commands. I prefer doing mine right within my preferred text editor <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a>.


![](/images/ReactFirebase_Day0_01.png "Terminal")

Make sure to have 'create-react-app' installed with command `npm i -g create-react-app`.

Go to the parent folder where you want your application to reside using `cd`.

Since my application's name is 'My Events', I am going to run the command `create-react-app my-events`. This should create a directory and some things in it. Go into it with the command `cd my-events`, then enter `npm start` to view it locally.

You should see this in your browser on `http://localhost:3000/`

![](/images/ReactFirebase_Day0_02.png "Our Default App Site")

## Deploy to Firebase
We have set up the default React application. Let's try to deploy it now.

First, we are going to create a folder and place our production-ready source code by running the command:

`npm run build`

We will also want the <a href="https://www.npmjs.com/package/firebase-tools" target="_blank">tools to deploy to our firebase</a> site. If you have not already run this command:

`npm install -g firebase-tools`

Now let's set up Firebase on our application. Run this command:

`firebase init`

You may have to run `firebase login` before running this command. Now, let's set up Firebase once you have logged in and run the `init` command. First, press `enter` to proceed by default.

![](/images/ReactFirebase_Day0_03.png "Proceed with firebase")

Next, using the `spacebar` to select and `enter` to confirm your choices, select **Database** and **Hosting**.

![](/images/ReactFirebase_Day0_04.png "Select Database and Hosting")

Now select the project that you previously made in Firebase.

![](/images/ReactFirebase_Day0_05.png "Select Firebase Project")

Keep the default for `What file should be used for Database Rules? (database.rules.json)`.

For our public directory we will want our build directory. Type `build` and press `enter`.

We want to create a single page application, so when it asks, do not use the default of "no" and type `yes`.

We do not want to overwrite our `index.html` file, so just say "no".

That should be the last question. Now let's deploy!

`firebase deploy`

![](/images/ReactFirebase_Day0_06.png "Firebase Deploy")

## Using the Firebase Database
Go to the <a href="https://console.firebase.google.com" target="_blank">Firebase console</a> and we will be modifying the script and adding it into our application. Using the scripts, we will be creating a js file with this.

![](/images/ReactFirebase_Day0_07.png "Firebase Database scripts")

In your `src` folder create a file called `fire.js`.

![](/images/ReactFirebase_Day0_08.png "Create fire.js")

Open this file. With the script that displayed in the Firebase console, modify it so it looks like below:

![](/images/ReactFirebase_Day0_09.png "fire.js file")

```
import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyBHujWjX2dljQzuXuTA0LcqHd1neM-JA8k",
  authDomain: "my-events-33491.firebaseapp.com",
  databaseURL: "https://my-events-33491.firebaseio.com",
  storageBucket: "my-events-33491.appspot.com",
  messagingSenderId: "116436781293"
};
var fire = firebase.initializeApp(config);
export default fire;
```

Let's now change the rules for the database. We will make everything readable and writable. In the future, we will change this. Open `database.rules.json` and change the rules to true for both read and write. The file should look like below.

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Run `npm install -S firebase` to install the Firebase packages.

That should be it for configuring the database. Now let's try deploying this.

```bash
npm run build
```

Then run:

```bash
firebase deploy
```

Nothing should change on the front-end side, but this is just a check to see if it all goes well.

## Creating our Events

In the `src/App.js` file, we will be adding some lines to it. You may remove the banner but I left it in. Here is how the code looks:

![](/images/ReactFirebase_Day0_10.png "App.js")

```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './fire';
class App extends Component {
 constructor(props) {
   super(props);
   this.state = { events: [] };
 }
 addEvent(e){
   e.preventDefault();
   fire.database().ref('events').push( this.eventNameEl.value );
   this.eventNameEl.value = '';
 }
 componentWillMount(){
   let eventsRef = fire.database().ref('events').orderByKey();
   eventsRef.on('child_added', eventNew => {
     let event = { text: eventNew.val(), id: eventNew.key };
     this.setState({ events: [event].concat(this.state.events) });
   })
 }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
       <form onSubmit={this.addEvent.bind(this)}>
         <input type="text" ref={ el => this.eventNameEl = el }/>
         <input type="submit"/>
         {
           this.state.events.map( event => <div key={event.id}>{event.text}</div> )
         }
       </form>
      </div>
    );
  }
}
export default App;
```

Now let's deploy this.

```bash
npm run build
```

Then run:

```bash
firebase deploy
```

When you navigate to your Hosting URL, you may see your old site. To fix this, all you have to do is `Empty Cache and Hard Reload` in the developer tools in Chrome or similar in another browser.

![](/images/ReactFirebase_Day0_11.png "App.js")

That should be it for this day. Look forward to future days where we will look at even more interesting stuff for your new app. In the meantime, I recommend learning React.

If you have any questions please reach out.

## Github files
<a href="https://github.com/ajgoldenwings/AnthonyJamesPearson/tree/2017-October-Branch/assets/demos/2017-12-17_How-to-Create-an-Event-Firebase-and-React-Single-Page-Web-App-Day0" target="_blank">Click here</a>
