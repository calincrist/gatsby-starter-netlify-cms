---
templateKey: blog-post
title: How To Do Analytics in Your React Native App with Firebase
date: 2020-01-17T16:32:55.520Z
description: >-
  You're building two mobile apps (iOS and Android) using React Native. The apps
  get approved in their stores. How do you know if your customers are enjoying
  your creation and find it useful? You don't unless you find a way to get
  insights and understand how your apps are used.
tags:
  - react-native 
  - ios 
  - firebase 
  - analytics 
  - android
---

## Choices

First, one has to decide what library should be used. Fortunately, there are some great ones that make it easy to integrate, like:

- [**AWS Amplify's Analytics**](https://aws-amplify.github.io/docs/js/analytics)
- [**Segment**](https://segment.com/docs/connections/sources/catalog/libraries/mobile/react-native/)
- **Firebase Analytics**

In this post, I'll be focusing on **Firebase Analytics** as it's one of the most popular. Especially because of its easy integration with **Google Analytics**.

Love it or hate it, Google services are still (arguably) the most popular ones for many valid reasons.




## Configure Firebase Account

Before integrating Firebase for React Native, you need a Firebase project in the [console](https://console.firebase.google.com/) (link).

This project will hold information for both iOS and Android apps.

In my case, I named the project "tutorial-demo".

<img src="https://thepracticaldev.s3.amazonaws.com/i/n66h20c0jo9l7wqlplt4.png" alt="Step 1/3" style="width:32%" /> 

<img src="https://thepracticaldev.s3.amazonaws.com/i/q4ltod2rvy2ka4sx58ix.png" alt="Step 2/3" style="width:32%" />

<img src="https://thepracticaldev.s3.amazonaws.com/i/pmkk4nho3xk6y7dj55ao.png" alt="Step 3/3" style="width:32%" />



### iOS project

After getting through the wizard, select the newly created project.

<img src="https://thepracticaldev.s3.amazonaws.com/i/hjjiy3ozue2zb4jbujsc.png" alt="" style="zoom:50%;" />



Now, we need to add different apps for different platforms. For iOS select the "iOS" icon.

Enter the native project's bundle ID (and App Store ID if you have one), give it a nickname and press "Register app".

<img src="https://thepracticaldev.s3.amazonaws.com/i/3p16we3pl1yikgdz8u0i.png" alt="Register app" style="zoom:33%; width:50% height:90px" />

<img src="https://thepracticaldev.s3.amazonaws.com/i/l6ajy1s7oippvnno8zuq.png" alt="Download config file" style="zoom: 30%; width: 50%;" />



The Firebase console provides a `GoogleService-Info.plist` file. 

This contains a set of credentials for iOS devices to use when authenticating with your Firebase project.

Download the "GoogleService-Info.plist" presented in the second step and add it to the iOS native project. 

Don't forget to select the correct target if you're having multiple targets. Also, don't forget to select "Copy items if needed".

<img src="https://thepracticaldev.s3.amazonaws.com/i/z6vz1xs416stvd4q2rse.png" alt="" style="zoom:50%;width:50%" />

<img src="https://thepracticaldev.s3.amazonaws.com/i/lz0zifox7soy91nsg06h.png" alt="" style="zoom:50%;width:50%" />



**Note**: Open "GoogleService-Info.plist" and enable analytics by setting "YES" the key "IS_ANALYTICS_ENABLED".

![IS_ANALYTICS_ENABLED](https://thepracticaldev.s3.amazonaws.com/i/w43ht5y8l0q39d4jih4n.png)

The 3rd step is not relevant for us, as we are covered by the firebase package that will add the pods for us.

The 4th step is something that we can add later. For now, let's finish with Firebase console configurations.



### Android project

The android side of things is very similar.

Go to the project homepage and select the "Android" icon. 

<img src="https://thepracticaldev.s3.amazonaws.com/i/y88ph232jbqfda78895s.png" alt="Step 1" style="zoom:100%;width:45%;" />

<img src="https://thepracticaldev.s3.amazonaws.com/i/r0vqh8gi5p4ys2ybamuw.png" alt="Step 2" style="zoom:100%;width:45%;" />

Here, we have again a config file - this time called "google-services.json". 

Add it to the native project inside the "app" folder from the android project folder.




## Install and Configure Firebase Analytics package

For React Native, there is the official Firebase package: [https://invertase.io/oss/react-native-firebase/](https://invertase.io/oss/react-native-firebase/)

It contains all the Firebase services and we'll be installing and using the *[Analytics](https://invertase.io/oss/react-native-firebase/v6/analytics)* one.



Install the core and analytics packages:

```bash
yarn add @react-native-firebase/app
yarn add @react-native-firebase/analytics
```

Assuming the React Native version is >= 0.60, the module should be automatically linked to your project.

If not, you need to manually integrate the `app` module into your project. See the following steps for [Android](https://invertase.io/oss/react-native-firebase/v6/app/android) and [iOS](https://invertase.io/oss/react-native-firebase/v6/app/ios) for more information on manual linking.



Install the pods for the iOS app:

    cd ios && pod install && cd ..

**iOS**: I noticed that after integrating the firebase package I needed to do some extra steps to make it work:

 - clear the "Derived Data" 
 - clean the project
 - remove the existing app from the simulator/testing device

**Android:** In case the build or the gradle syncing is failing - it happened to me in one occasion, this is what I modified. 
 I think it has to do with auto-linking failing for some reason.

 *android/build.gradle*

 ```groovy
 buildscript {
 		// ...
     dependencies {
 				// ...
         classpath 'com.google.gms:google-services:4.3.2' // <---
     }
 }
 ```

 *android/app/build.gradle*

 ```groovy
 dependencies {
 		// ...
     implementation 'com.google.firebase:firebase-analytics:17.2.0' // <---
 		// ...
 }
 // ...
 
 apply plugin: 'com.android.application'        // <---
 apply plugin: 'com.google.gms.google-services' // <---
 ```



## Analytics layer


### Automatic events

Just by integrating the Analytics package there are some events that are collected automatically like:

*first_open, user_engagement, app_clear_data .* 

More details are provided here: [https://support.google.com/firebase/answer/6317485](https://support.google.com/firebase/answer/6317485)

### Custom events

What's cool about this package is that it provides predefined methods for different use cases depending on the nature of your app (e-commerce, games, etc.), but also bare-bones functions to customize your own event loggings.

Long story short, what we can do using react-native-firebase is:

- Log custom events

  ```javascript
  await analytics().logEvent("event_name", {"key_1": "value_1", "key_2": "value_2"});
  ```

  

- Log the opening of the app

  ```js
  await firebase.analytics().logAppOpen();
  ```

  

- Log the sign in/sign up event

  ```javascript
  await firebase.analytics().logLogin({
    method: 'facebook',
  });
  
  await firebase.analytics().logSignUp({
    method: 'facebook',
  });
  ```

> Behind the scenes, these specific events (logAppOpen, logLogin, logSignUp) are using the logEvent method specifying the key and some properties for you.



- Set user properties

  ```javascript
  await analytics().setUserId("id");
  await analytics().setUserProperty('email', email); // <--- DON'T DO THIS !!!
  await analytics().setUserProperties('account', {
  	'subscription': 'premium'
  });
  ```

  > It is highly recommended not to send any fragile and secret data to firebase (emails, passwords, names, etc.) - not even hashed.



- Tracking screens

  ```javascript
  await analytics().setCurrentScreen("screen_name", "screen_name");
  ```

  

And these are just a bunch of them. [**Here**](https://invertase.io/oss/react-native-firebase/v6/analytics/reference/module#logViewItem) are all the supported methods.




## Integrating it in your project and use cases

Now, to demo these events, let's do an old-fashioned class that we will be used to centralize the analytics code. An advantage of this approach would be that we can use multiple analytics solutions/packages by updating just one file. (Of course, it doesn't need to be a class but here we are :) )

```javascript
    import analytics, { firebase } from '@react-native-firebase/analytics';
    
    class Analytics {
      static init() {
        if (firebase.app().utils().isRunningInTestLab) {
          analytics().setAnalyticsCollectionEnabled(false);
        } else {
          analytics().setAnalyticsCollectionEnabled(true);
        }
      }
    
      static onSignIn = async userObject => {
        const { id, email } = userObject;
        await Promise.all([
          analytics().setUserId(id),
          analytics().setUserProperty('email', email), // <--- DON'T DO THIS !!!
          this.logEvent("sign_in")
        ]);
      };
    
      static onSignUp = async userObject => {
        const { id, email } = userObject;
        await Promise.all([
          analytics().setUserId(id),
          analytics().setUserProperty('email', email),  // <--- DON'T DO THIS !!!
          analytics().setUserProperty('created_at', new Date()),
          this.logEvent("sign_up")
        ]);
      };
    
      static setCurrentScreen = async screenName => {
        await analytics().setCurrentScreen(screenName, screenName);
      };
    
      static logEvent = async (eventName, propertyObject = {}) => {
        await analytics().logEvent(eventName, propertyObject);
      }
    
      static onSignOut = async () => {
        await analytics().resetAnalyticsData();
      };
    }
    
    export default Analytics;
```



### Track Sign ins

What's left is to use our Analytics static methods where they belong in the code
```javascript
    // src/screens/Login.js
    
    // ...imports
    
    const Login = () => {
    
      const { navigate } = useNavigation();
    
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('')
    
      const loginAction = async () => {
    
        //  validate inputs...
        //  api call for signing in...
    
        navigate('SignedIn');
        await Analytics.onSignIn({ id: "1", email })
      }
    
      return (
    	 // ...
      );
    
    }
```




### Tracking screens

Here we have multiple options depending on what do we need. 

Either track them separately in each component after they're being mounted or making use of events other packages we might have in our project. One example could be the beloved and frequently used react-navigation.

- useEffect hook inside the components.

```javascript
const HomepageScreen = () => {
  
  useEffect(() => {
    Analytics.setCurrentScreen('Homepage');
  }, []);

  return ( ... )
}
```



- navigation state changes directly on the app container. 

```javascript
// App.js

const AppContainer = createAppContainer(Navigator);

const App = () => {

	// Helper method
  const getActiveRouteName = navigationState => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  };

  return (
    <Provider store={store}>
      <AppContainer
        onNavigationStateChange={(prevState, currentState, action) => {
          const currentRouteName = getActiveRouteName(currentState);
          const previousRouteName = getActiveRouteName(prevState);

          if (previousRouteName !== currentRouteName) {
            Analytics.setCurrentScreen(currentRouteName);
          }
        }}
      />
    </Provider>
  )
}

export default App;
```




### Custom events

An example would be to track in an image sharing app either the users are more inclined to use the camera or the camera roll.
```javascript
    // src/screens/Camera.js
    
    // ...imports
    const CameraScreen = ({ ... }) => {
    
      const { navigate } = useNavigation();
    
      const takePicture = async () => {
        if (this.camera) {
    	    // ...
          Analytics.logEvent("add_image", {
            "take_picture": true,
            "camera_roll": false
          });
    
          navigate('ImagesList');
        }
      }
    
      return (
        // ...
      );
    }
```




## Last step: see it working

Everything is installed, configured and implemented. Let's see if we get something from the app to the Firebase Console.

Nothing?...

Well, there is a delay of about 1 hour between logging and seeing the events on the dashboard. 

The good news is that there is something we can do to test it quickly - with a latency of about 1 second.

It is called **DebugView**.



### iOS

For the iOS project, we can pass an argument on the Run process by editing the scheme.

The argument is called -FIRDebugEnabled

![FIRDebugEnabled](https://thepracticaldev.s3.amazonaws.com/i/8wwabv04f2huw55bumey.png)

For the Release builds, we should specify the argument **-FIRDebugDisabled**.



### Android

To enable Debug mode on Android, just run:

    adb shell setprop debug.firebase.analytics.app package_name

This behaviour persists until you explicitly disable Debug mode by specifying the following command-line argument:

    adb shell setprop debug.firebase.analytics.app .none.

Now run the apps again and you should see some action in the Firebase console:

![Debug view](https://thepracticaldev.s3.amazonaws.com/i/f8aqg1pwvs7hyoc8zw48.png)

> From my experience: if for some mystical reason it doesn't work on iOS, what did the trick for me is to manually link the libraries in Xcode, like in the picture below.
>
> <img src="https://thepracticaldev.s3.amazonaws.com/i/h8d0rme5p3w94xkny0y9.png" alt="Integrate libs" style="zoom: 50%;" />




## Conclusion

And that's pretty much it.

What you can do from here is release your app and gather valuable information. Pair it with data from Google Analytics and you have the power (**and the data to back it up**) to decide what's the best next move.

For the full code here's the Github link: [https://github.com/calincrist/imageSharingApp](https://github.com/calincrist/imageSharingApp).



Previous blog post:
[How To Do Authentication using AWS Amplify in iOS](https://dev.to/calin_crist/how-to-do-authentication-using-aws-amplify-in-ios-4kb6)
