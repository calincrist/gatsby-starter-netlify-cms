---
templateKey: blog-post
title: How To Do Authentication using AWS Amplify in iOS
date: 2017-01-04T15:04:10.000Z
description: >-
  If you are a developer, there's a 99% chance that you'll be dealing with
  authenticating your apps users.​ The authentication flows need to be secure,
  easy to integrate and customisable. It may sound easy. But most of the times
  dealing with this feature requires more work than we'd want. That's where AWS
  Amplify comes into play. It makes this experience workable for developers and
  risk-less for users.
tags:
  - brewing
  - chemex
---

In this blog post I would like to prove this by showing how I integrated AWS Amplify Auth component into my iOS app.


### **AWS Amplify**

AWS Amplify is an open source library for developers that want to integrate the powerful AWS services (Auth, API, S3 Storage, etc.) into their mobile/web apps.

It has a great strength: you need no über-strong backend knowledge to deploy and integrate. By using this, you can focus more on building your app than configuring.

### **Auth**

> "AWS Amplify Authentication module provides Authentication APIs and building blocks for developers who want to create user authentication experiences." ([https://aws-amplify.github.io/docs/js/authentication](https://aws-amplify.github.io/docs/js/authentication))

It has a great strength: you need no über-strong backend knowledge to deploy and integrate. By using this, you can focus more on building your app than configuring.

## What/How is implemented

What I have planned is to create a basic iOS app and to add authentication flows to it:
- login
- sign up
- reset password

### Diagram

To be easier to understand, here's a diagram:

![](b6feabe3d8a04618ae9301b767233aa5-c5b58d75-7c62-4b80-a457-2da63980b547.png)

## **Create basic iOS app project**

I created a SingleView Swift project and called it *aws_amplify_integration*.

![](Screenshot_2019-05-18_at_16-c0a6c0ee-0b6d-4206-9927-6050b1654462.51.21.png)

![](Screenshot_2019-05-18_at_16-c352e2a3-6ece-4993-a1e4-8d9672d970ee.52.03.png)

1. Folder structure

    Here's a screenshot with what I propose to be the folder structure:

![](Screenshot_2019-05-18_at_16-389f1df9-73c4-4fe9-9e47-e2cb7cee6e23.49.21.png)

## Customise UI

The UI is pretty basic for the sake of the tutorial. 

The Github link to the project can please your curiosity if you want to take a look over the xib files.

## Add AWS Amplify libs

What needs to be done is very well explained on AWS Amplify docs ([https://aws-amplify.github.io/docs/ios/start](https://aws-amplify.github.io/docs/ios/start)). But I will extract the important steps.

### Install AWS Amplify

Install Nodejs and npm, and then run:

    npm install -g @aws-amplify/cli
    amplify configure

Install Cocoapods:

    sudo gem install cocoapods
    pod init

Open the Podfile and add the pods for AWS Mobile SDK to work:

    platform :ios, '11.0'
    
    target 'aws_amplify_integration' do
      use_frameworks!
      pod 'AWSCore', '~> 2.9.0'
      pod 'AWSMobileClient', '~> 2.9.0'
    end

Install dependencies:

    pod install --repo-update

Remember to open the newly created *aws_amplify_integration.workspace.*

Build the project in Xcode.

### Setup AWS services

What needs to be done is to create new AWS backend resources. After that, pull the AWS services configuration into the app.

In a terminal window, navigate to your project folder (the folder that contains your xcodeproj file).

Run the following command (for this app, accepting all defaults is OK):

    amplify init        #accept defaults
    amplify push        #creates configuration file

In the Finder, drag `awsconfiguration.json` into Xcode under the top Project Navigator folder (the folder name should match your Xcode project name). When the `Options` dialog box that appears, do the following:

- Clear the `Copy items if needed` check box.
- Choose `Create groups`, and then choose `Next`.

### Add Auth

To enjoy the automated setup, run the following command in your project’s root folder.

The CLI prompts will help you to customize your auth flow for your app.

    amplify add auth

After configuring your Authentication options, update your backend:

    amplify push

Now, the `awsconfiguration.json` is updated with Cognito configs:

![](Screenshot_2019-05-18_at_17-857c70a8-0cf7-439a-8c40-b1d2adf2928f.48.49.png)

If it's not, make sure that you added this file to your project.

## Integrate Amplify Auth

### Check for auth state

First, `AWSMobileClient` needs to be imported to use the client to check for the authentication state.

By calling *sharedInstance()* the configurations are being pulled from `awsconfiguration.json`. This manages the users' session for auth tasks like automatic credentials management and refresh routines.

The *initialize()* method will start a new session. The result contains an ENUM value that exposes the current user state:

    public enum UserState: String {
        case signedIn, signedOut, signedOutFederatedTokensInvalid, signedOutUserPoolsTokenInvalid, guest, unknown
    }

We can take advantage of this workflow to determine what to present to the user. For this example we use *signedIn*.

If the user is logged in we can redirect to *MainViewController,* otherwise to *LoginViewController.*

    import UIKit
    import AWSMobileClient
    
    class SplashViewController: UIViewController {
    
        override func viewDidLoad() {
            super.viewDidLoad()
    
            AWSMobileClient.sharedInstance().initialize { (userState, error) in
                if let error = error {
                    print("error: \(error.localizedDescription)")
                    return
                }
                
                guard let userState = userState else {
                    return
                }
                
                print("The user is \(userState.rawValue).")
                
                // Check user availability
                switch userState {
                case .signedIn:
                    // Show home page
                    let mainViewController = MainViewController()
                    UIApplication.setRootView(mainViewController)
                    break
                    
                default:
                    // Show login page
                    let loginViewController = LoginViewController()
                    UIApplication.setRootView(loginViewController)
                    break
                }
            }
        }
    }

In AppDelegate.swift's method *didFinishLaunchingWithOptions* we present the *SplashScreenViewController*.

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
            
        IQKeyboardManager.shared.enable = true
        window = UIWindow(frame: UIScreen.main.bounds)
        
        if let window = window {
            window.backgroundColor = #colorLiteral(red: 0.9960784314, green: 0.9960784314, blue: 0.9960784314, alpha: 1)
            
            let splashViewController = SplashViewController()
            window.makeKeyAndVisible()
            window.rootViewController = splashViewController
            
        }
        
        return true
    }

### Login flow

When the user is not signed in the login screen in presented.
From here the user can:
- enter a username and a password to login
- go to sign up flow
- go to reset password flow

The outlets are referenced to *UITextFields* and the *touch up inside event* is referenced to the login method. 

Now, in this method, we can use *AWSMobileClient* to sign in using a username and a password. This action calls a completion handler when a result is available.

    public func signIn(username: String, 
    									 password: String, 
    									 validationData: [String: String]? = nil, 
    									 completionHandler: @escaping ((SignInResult?, Error?) -> Void))

The error is a *AWSMobileClientError* enum value. This enum has 42 cases.

Usually, your needs won't reach all the client errors. But it's a good practice to handle most of them to give proper feedback to the users.

    /// The error enum for `AWSMobileClient` errors.
    public enum AWSMobileClientError: Error {
        case aliasExists(message: String)
        case codeDeliveryFailure(message: String)
        case codeMismatch(message: String)
        case expiredCode(message: String)
        case groupExists(message: String)
        case internalError(message: String)
        case invalidLambdaResponse(message: String)
        case invalidOAuthFlow(message: String)
        case invalidParameter(message: String)
        case invalidPassword(message: String)
        case invalidUserPoolConfiguration(message: String)
        case limitExceeded(message: String)
        case mfaMethodNotFound(message: String)
        case notAuthorized(message: String)
        case passwordResetRequired(message: String)
        case resourceNotFound(message: String)
        case scopeDoesNotExist(message: String)
        case softwareTokenMFANotFound(message: String)
        case tooManyFailedAttempts(message: String)
        case tooManyRequests(message: String)
        case unexpectedLambda(message: String)
        case userLambdaValidation(message: String)
        case userNotConfirmed(message: String)
        case userNotFound(message: String)
        case usernameExists(message: String)
        case unknown(message: String)
        case notSignedIn(message: String)
        case identityIdUnavailable(message: String)
        case guestAccessNotAllowed(message: String)
        case federationProviderExists(message: String)
        case cognitoIdentityPoolNotConfigured(message: String)
        case unableToSignIn(message: String)
        case invalidState(message: String)
        case userPoolNotConfigured(message: String)
        case userCancelledSignIn(message: String)
        case badRequest(message: String)
        case expiredRefreshToken(message: String)
        case errorLoadingPage(message: String)
        case securityFailed(message: String)
        case idTokenNotIssued(message: String)
        case idTokenAndAcceessTokenNotIssued(message: String)
        case invalidConfiguration(message: String)
        case deviceNotRemembered(message: String)
    }


When there is no error, the `SignInResult` contains the state of the user.

    public enum SignInState: String {
        case unknown = "UNKNOWN"
        case smsMFA = "CONFIRMATION_CODE"
        case passwordVerifier = "PASSWORD_VERIFIER"
        case customChallenge = "CUSTOM_CHALLENGE"
        case deviceSRPAuth = "DEVICE_SRP_AUTH"
        case devicePasswordVerifier = "DEVICE_PASSWORD_VERIFIER"
        case adminNoSRPAuth = "ADMIN_NO_SRP_AUTH"
        case newPasswordRequired = "NEW_PASSWORD_REQUIRED"
        case signedIn = "SIGN_IN_COMPLETE"
    }


Here is the entire implementation and handling.

When the sign in in complete, redirect to *MainViewController.*

    import UIKit
    import AWSMobileClient
    
    class LoginViewController: UIViewController {
    
        @IBOutlet weak var usernameTextField: UITextField!
        @IBOutlet weak var passwordTextField: UITextField!
    
        @IBAction func login(_ sender: Any) {
            
            guard let username = usernameTextField.text,
                let password = passwordTextField.text  else {
                print("Enter some values please.")
                return
            }
            
            print("\(username) and \(password)")
            
            AWSMobileClient.sharedInstance().signIn(username: username, password: password) { 
    						(signInResult, error) in
    
    	            if let error = error  {
    	                print("There's an error : \(error.localizedDescription)")
    	                print(error)
    	                return
    	            }
    	            
    	            guard let signInResult = signInResult else {
    	                return
    	            }
    	            
    	            switch (signInResult.signInState) {
    	            case .signedIn:
    	                print("User is signed in.")
    	                
    	                DispatchQueue.main.async {
    	                    let mainViewController = MainViewController()
    	                    UIApplication.setRootView(mainViewController)
    	                }
    	                
    	            case .newPasswordRequired:
    	                print("User needs a new password.")
    	            default:
    	                print("Sign In needs info which is not et supported.")
    	            }
            }
        }
    }

### Sign Up flow

Here we have 2 screens to complete this flow:

1. Enter account details (full name, email, username, password) 
    - *SignUpViewController*
2. Confirm the verification code
    - *ConfirmSignUpViewController*

In AWS Amplify, signing up and confirming look very similar to the sign in process. 

The only thing that is different is the result. It's using `SignUpResult` that contains the signUp confirmation state.

    /// Indicates the state of user during the sign up operation.
    public enum SignUpConfirmationState {
        case confirmed, unconfirmed, unknown
    }

When the state is *unconfirmed,* Cognito sends a verification code. It can be through SMS or Email, depending on how Cognito is configured. 

Then, the app proceeds to the confirmation screen.

    import AWSMobileClient
    
    class SignUpViewController: UIViewController {
    
        @IBOutlet weak var passwordTextField: UITextField!
        @IBOutlet weak var usernameTextField: UITextField!
        @IBOutlet weak var emailTextField: UITextField!
        @IBOutlet weak var fullNameTextField: UITextField!
        
    		@IBAction func createAccount(_ sender: Any) {
            
            guard let fullName = fullNameTextField.text,
                let email = emailTextField.text,
                let username = usernameTextField.text,
                let password = passwordTextField.text else {
                return
            }
            
            AWSMobileClient.sharedInstance().signUp(username: username,
                                                    password: password,
                                                    userAttributes: ["email" : email, "name": fullName],
                                                    completionHandler: signUpHandler);
        }
    
        func signUpHandler(signUpResult: SignUpResult?, error: Error?) {
            
            if let error = error {
                if let error = error as? AWSMobileClientError {
                    switch(error) {
                    case .usernameExists(let message):
                        print(message)
                    default:
                        break
                    }
                }
                print("There's an error on signup: \(error.localizedDescription), \(error)")
            }
            
            guard let signUpResult = signUpResult else {
                return
            }
            
            switch(signUpResult.signUpConfirmationState) {
            case .confirmed:
                print("User is signed up and confirmed.")
                
                DispatchQueue.main.async {
                    let mainViewController = MainViewController()
                    UIApplication.setRootView(mainViewController)
                }
                
            case .unconfirmed:
                let alert = UIAlertController(title: "Code sent",
                                              message: "Confirmation code sent via \(signUpResult.codeDeliveryDetails!.deliveryMedium) to: \(signUpResult.codeDeliveryDetails!.destination!)",
                    preferredStyle: .alert)
                
                alert.addAction(UIAlertAction(title: "Dismiss", style: .cancel) { _ in
                    guard let username = self.usernameTextField.text else {
                        return
                    }
                    let confirmSignupViewController = ConfirmSignUpViewController(username: username)
                    self.navigationController?.pushViewController(confirmSignupViewController, animated: true)
                })
                
                DispatchQueue.main.async {
                    self.present(alert, animated: true, completion: nil)
                }
                
            case .unknown:
                print("Unexpected case")
            }
        }
        
        @IBAction func dismissModal(_ sender: Any) {
            self.navigationController?.dismiss(animated: true, completion: nil)
        }
    }


*ConfirmSignUpViewController.swift*:


    import AWSMobileClient
    
    class ConfirmSignUpViewController: UIViewController {
    
        @IBOutlet weak var verificationCodeTextField: UITextField!
        var username: String?
        
        init(username: String, nibName nibNameOrNil: String? = nil, bundle nibBundleOrNil: Bundle? = nil) {
            self.username = username
            super.init(nibName:nibNameOrNil, bundle: nibBundleOrNil)
        }
        
        required init?(coder aDecoder: NSCoder) {
            fatalError("init(coder:) has not been implemented")
        }
    
    		@IBAction func confirmSignUp(_ sender: Any) {
            
            guard let verificationCode = verificationCodeTextField.text,
                let username = self.username else {
                print("No username")
                return
            }
            
            AWSMobileClient.sharedInstance().confirmSignUp(username: username,
                                                           confirmationCode: verificationCode,
                                                           completionHandler: handleConfirmation)
        }
    
    		func handleConfirmation(signUpResult: SignUpResult?, error: Error?) {
            if let error = error {
                print("\(error)")
                return
            }
            
            guard let signUpResult = signUpResult else {
                return
            }
            
            switch(signUpResult.signUpConfirmationState) {
            case .confirmed:
                print("User is signed up and confirmed.")
                
                DispatchQueue.main.async {
                    let mainViewController = MainViewController()
                    UIApplication.setRootView(mainViewController)
                }
                
            case .unconfirmed:
                print("User is not confirmed and needs verification via \(signUpResult.codeDeliveryDetails!.deliveryMedium) sent at \(signUpResult.codeDeliveryDetails!.destination!)")
            case .unknown:
                print("Unexpected case")
            }
        }
    
        @IBAction func resendCode(_ sender: Any) {
            guard let username = self.username else {
                print("No username")
                return
            }
            
            AWSMobileClient.sharedInstance().resendSignUpCode(username: username,
                                                              completionHandler: resendSignUpHandler)
        }
    
        func resendSignUpHandler(result: SignUpResult?, error: Error?) {
            if let error = error {
                print("\(error)")
                return
            }
            
            guard let signUpResult = result else {
                return
            }
            
            let message = "A verification code has been sent via \(signUpResult.codeDeliveryDetails!.deliveryMedium) at \(signUpResult.codeDeliveryDetails!.destination!)"
            let alert = UIAlertController(title: "Code Sent",
                                          message: message,
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Dismiss", style: .cancel, handler: { _ in
                //Cancel Action
            }))
            
            DispatchQueue.main.async {
                self.present(alert, animated: true, completion: nil)
            }
        }
        
        @IBAction func dismissModal(_ sender: Any) {
            self.navigationController?.dismiss(animated: true, completion: nil)
        }
    }

### Reset password flow

This flow is a 2 step process. 

First, the user has to receive a confirmation code through email or SMS. It is done by calling forgotPassword(username: username). The details about how the code was sent can be retrieved from the UserCodeDeliveryDetails included in the response.

    /// Indicates the state of forgot password operation.
    public enum ForgotPasswordState {
        case done, confirmationCodeSent
    }
    
    /// Contains the result of the forgot password operation.
    public struct ForgotPasswordResult {
        public let forgotPasswordState: ForgotPasswordState
        public let codeDeliveryDetails: UserCodeDeliveryDetails?
        
        internal init(forgotPasswordState: ForgotPasswordState, codeDeliveryDetails: UserCodeDeliveryDetails?) {
            self.forgotPasswordState = forgotPasswordState
            self.codeDeliveryDetails = codeDeliveryDetails
        }
    }

Then this code is used to confirm the new password.

    confirmForgotPassword(username: username, newPassword: newPassword, confirmationCode: confirmationCode)

Here we have 2 screens:

1. Enter username
    - ResetPasswordViewController
2. Confirm the verification code and enter a new password
    - NewPasswordViewController

    import UIKit
    import AWSMobileClient
    
    class ResetPasswordViewController: UIViewController {
    
        @IBOutlet weak var usernameTextField: UITextField!
        
        @IBAction func submitUsername(_ sender: Any) {
            
            guard let username = usernameTextField.text else {
                print("No username")
                return
            }
            
            AWSMobileClient.sharedInstance().forgotPassword(username: username) { (forgotPasswordResult, error) in
                if let forgotPasswordResult = forgotPasswordResult {
                    switch(forgotPasswordResult.forgotPasswordState) {
                    case .confirmationCodeSent:
                        guard let codeDeliveryDetails = forgotPasswordResult.codeDeliveryDetails else {
                            return
                        }
                        
                        let alert = UIAlertController(title: "Code sent",
                                                      message: "Confirmation code sent via \(codeDeliveryDetails.deliveryMedium) to: \(codeDeliveryDetails.destination!)",
                                                      preferredStyle: .alert)
                        
                        DispatchQueue.main.async {
                            self.present(alert, animated: true, completion: nil)
                        }
                        
                    default:
                        print("Error: Invalid case.")
                    }
                } else if let error = error {
                    print("Error occurred: \(error.localizedDescription)")
                }
            }
        
        
        }
        
        @IBAction func dismiss(_ sender: Any) {
            self.navigationController?.dismiss(animated: true, completion: nil)
        }
    }

    import UIKit
    import AWSMobileClient
    
    class NewPasswordViewController: UIViewController {
        
        @IBOutlet weak var verificationCodeTextField: UITextField!
        @IBOutlet weak var newPasswordTextField: UITextField!
        
        var username: String?
        
        init(username: String, nibName nibNameOrNil: String? = nil, bundle nibBundleOrNil: Bundle? = nil) {
            self.username = username
            super.init(nibName:nibNameOrNil, bundle: nibBundleOrNil)
        }
        
        required init?(coder aDecoder: NSCoder) {
            fatalError("init(coder:) has not been implemented")
        }
    
        @IBAction func verifyCode(_ sender: Any) {
            
            guard let username = username,
                let newPassword = newPasswordTextField.text,
                let confirmationCode = verificationCodeTextField.text else {
                return
            }
            
            AWSMobileClient.sharedInstance().confirmForgotPassword(username: username,
                                                                   newPassword: newPassword,
                                                                   confirmationCode: confirmationCode) { (forgotPasswordResult, error) in
                if let forgotPasswordResult = forgotPasswordResult {
                    switch(forgotPasswordResult.forgotPasswordState) {
                    case .done:
                        self.dismiss(self)
                    default:
                        print("Error: Could not change password.")
                    }
                } else if let error = error {
                    print("Error occurred: \(error.localizedDescription)")
                }
            }
        }
        
        @IBAction func dismiss(_ sender: Any) {
            self.navigationController?.dismiss(animated: true, completion: nil)
        }
    }

### Sign Out action

There is not much to say about it :) Call the following and the user will be logged out from the current device by clearing the local keychain store.

    AWSMobileClient.sharedInstance().signOut()

Also, this can be a global action that logs out the user from all active sessions - all the devices. It invalidates all tokens: id token, access token and refresh token. 

Although the tokens are revoked, the AWS credentials will remain valid until they expire (which by default is 1 hour).

This is not a default behaviour, so we need to specify the signOut options using a SignOutOptions object:

    /// Signout options to change the default behavior.
    public struct SignOutOptions {
        let invalidateTokens: Bool
        let signOutGlobally: Bool
        
        /// Initializer: Signout options to change the default behavior.
        ///
        /// - Parameters:
        ///   - signOutGlobally: Invalidate all active sessions with the service. The user will be logged out of all devices.
        ///   - invalidateTokens: If functionality available, the access token, refresh token and id token will be invalidated and won't be usable.
        public init(signOutGlobally: Bool = false, invalidateTokens: Bool = true) {
            self.signOutGlobally = signOutGlobally
            self.invalidateTokens = invalidateTokens
        }
    }

    AWSMobileClient.sharedInstance().signOut(options: SignOutOptions(signOutGlobally: true)) { (error) in
        print("Error: \(error.debugDescription)")
    }

    import UIKit
    import AWSMobileClient
    
    class MainViewController: UIViewController {
    
        @IBOutlet weak var logOutButton: UIButton!
    
        @IBAction func logOut(_ sender: Any) {
            AWSMobileClient.sharedInstance().signOut() { error in
                if let error = error {
                    print(error)
                    return
                }
            }
            
            
            let loginViewController = LoginViewController()
            UIApplication.setRootView(loginViewController)
        }
        
    }

## Conclusion

That's it! And it's just one component from many others.

The Amplify library is a real game changer when it comes to development speed and reliability. Next step would be to use and handle other AWS services like Storage, Push Notifications or API.

It's really nice to focus on implementing features and not libraries.

## Links

- Github link

    [calincrist/aws_amplify_integration](https://github.com/calincrist/aws_amplify_integration.git)

- Twitter link

    [Calin Cristian (@calin_crist) | Twitter](https://twitter.com/calin_crist)

- Linkedin link

    [Calin - Cristian Ciubotariu - Freelance Software Developer - Self-employed Contractor | LinkedIn](http://www.linkedin.com/in/calincrist)

- Upwork link
