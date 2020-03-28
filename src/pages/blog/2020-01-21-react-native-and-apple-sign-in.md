---
templateKey: blog-post
title: 'React Native and Apple Sign In '
date: 2020-01-21T22:22:37.220Z
featured_image: /img/sign-in-with-apple-bambi.png
description: >-
  Apple's approach to authentication is focused on privacy, simplicity, security
  and ... it's mandatory if you want to integrate other social logins in your
  iOS app.
tags:
  - react native
  - apple
  - auth
  - ios

---

## Project and account config

### Add Capabilities

> Every step from below are nicely described here with images: https://github.com/invertase/react-native-apple-authentication/blob/master/docs/INITIAL_SETUP.md

Even if you have an existing project or starting the project from scratch, you have to add the **Sign in with Apple** capabitilty.

Like about everything regarding Apple configurations, there are a few steps to do, which I briefly describe:

- <u>From Apple developer account console</u>
  - Select **Certificates, IDs & Profiles** from the left panel
  - Click on **Identifiers** in the left panel. Click on your project's *bundle identifier*
  - Scroll down to **Sign in with Apple**, and tick the checkbox
  - Click the **Edit** button. Select **Enable as a primary App ID** and click **Save** button
  - Click on **Keys** in left panel menu and create a new key. 
  - Give it a cool name. Tick the checkbox next to **Sign In with Apple**, and click **Configure**
  - Select your project's bundle id as the primary app ID
  - Register your key, download it and keep it secure

<!--"Almost there" image/meme-->

- <u>From Xcode</u>
  - select your target
  - go to **Signing and Capabilities**
  -  Click **+ Capability** and from the menu select **Sign in with Apple**
  - Remember to sign in as your development team. As you may expect, there shouldn't be any error messages.

<!--"Finally done" image/meme-->



## Library integration

For the React Native integration, I recommend using Invertase's library:  [https://github.com/invertase/react-native-apple-authentication](https://github.com/invertase/react-native-apple-authentication). Personally I had a good developer experience using some of their tools.

- Add the `react-native-apple-authentication` dependency:

```bash
yarn add @invertase/react-native-apple-authentication
```

- Update the native Xcode project:

```bash
cd ios && pod install && cd ..
```




## Apple Sign in

Initialize an authentication session with your app server and associate a client session with an **ID token** using the `nonce` value. You can request to receive the user’s information, such as name and email address. If the user has approved accessing this information, your authorization request then includes the requested information.

*Note*: Apple will only provide you the requested details on the *first* authentication.



### Sign Up vs. Sign In





### Implementation

Let's assume you have what I had when my task was to implement Apple Sign In:

- Redux for the state management
  - user : an object that contains everything about the user: email, full name etc.
  - userAuthState: an object that describes the authentication state of the user. Here, we will be using a simple string for breivity.
  - updateUserAuthState: a function that updates the userAuthState in the Redux state tree

All of these are passed as props in the `AppleAuthentication` component.

Truth to be told, it doesn't matter what state management *thing* you're using, as long as you have a way to store and update the auth data.

```javascript
import React, { useEffect } from 'react';
import { Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';


const AppleAuthentication = ({ user, userAuthState, updateUserAuthState }) => {
  
  //	Check if the device supports this feature.
  //	Devices pre-iOS 13 (and all Android devices) will not support this.
  if (!appleAuth.isSupported) {
    return (<Text>Sign in with Apple is not supported.</Text>);
  }
  
  useEffect(() => {
    // `onCredentialRevoked` returns a function that will remove the event listener. 
    //  useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.log('Apple Credential Revoked');
      checkCredentialState(updateUserAuthState);
    });
  }, []); 
  // passing in an empty array as the second argument ensures 
  // this is only ran once when component mounts initially.
  

  useEffect(() => {
    checkCredentialState(updateUserAuthState);
  }, [user]);
  // passing in array with the user object as the second argument ensures 
  // this is called when component mounts initially and 
  // the `user` object is updated.
  

  const checkCredentialState = async () => {
    // ...
  }
  
  const appleSignInAction = async () => {
    // ...
  };
  
  return (
      <AppleButton
        style={{ /* Your custom button container styles*/ }}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.CONTINUE}
        onPress={appleSignInAction}
      />
  );
};

AppleAuthentication.propTypes = {
  user: PropType.shapeOf({...}),
  userAuthState: PropType.string,
  updateUserAuthState. PropType.func.isRequired
}

AppleAuthentication.defaultProps = {
  userAuthState: null,
  user: null
}

const mapStateToProps = state => ({
  user: state.user, 
  userAuthState: state.userAuthState, 
});

const mapDispatchToProps = dispatch => {
  return {
      updateUserAuthState: (newState) => dispatch(/*...*/),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppleAuthentication);
```



```javascript
/**
 * Fetches the credential state for the current user, if any, and updates state on completion.
 */
const checkCredentialState = async () => {
  
  if (!user) {
    updateUserAuthState(null);
  }

  try {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        updateUserAuthState('AUTHORIZED');
      } else {
        updateUserAuthState(credentialState);
      }
  } catch (error) {
	    updateUserAuthState(`Error: ${error.code}`);
  }
}	
```



```javascript
const appleSignInAction = async () => {
    
    try {
    	// Start the sign in request. 
      // Request for the `email` and the `full name`
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const {
        identityToken,
        nonce,
        email,
        user,
      } = appleAuthRequestResponse;

      if (identityToken && nonce) {
        
        let fullName = null;
        if (
            appleAuthRequestResponse.fullName &&
            appleAuthRequestResponse.fullName.givenName &&
            appleAuthRequestResponse.fullName.familyName
          ) { 
          fullName = `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`;
        }
        
        // `appleAuthRequestResponse.fullName` will return null for subsequent sign in requests.

        //	Use the `identityToken` and `nonce` to get the user details or 
        //  create the user on your own backend/identity manager (e.g. Firebase, AWS Amplify)

        //	Create/Update the `user` object in the local Redux store.
        
      } else {
        // handle this - retry?
				Alert.alert('Please try again.');
      }
      
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
};
```



### Explanation






