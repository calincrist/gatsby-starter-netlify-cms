---
templateKey: blog-post
title: Step up your button theme in SwiftUI
date: 2020-05-12T17:31:18.901Z
featured_image: /img/swiftui-96x96_2x.png
description: Create a UI library for you buttons. Your app needs it!
tags:
  - ios
  - swiftui
  - swift
  - button
---
<!-- How to theme your SwiftUI buttons with reusable ButtonStyle modifiers -->

# 1. Introduction

<!-- Something about the importance of buttons in an app -->

In the [previous blog post](https://www.calincrist.com/blog/2020-05-02-beginners-guide-to-view-modifiers-swiftui/) I talked about what are view modifiers and how can we use them to create stylish UI in our SwiftUI apps.

Here I will present how to apply them to create reusable styles for buttons.



# 2. React Native UI libraries

### Short backstory

In 2019 I started a "sabbatical" year and a half from native iOS development. I started to develop mobile apps using React Native as my main job. 

I learned a lot, but what amazed me was the power to quickly prototype apps with existing UI libraries. Where I came from (the native development world) that wasn't even a thought.

What I used back then was [Callstack's React Native Paper (material design)](https://callstack.github.io/react-native-paper/) and then [NativeBase](https://nativebase.io). 

Import, use and still customise was mind blowing to me. I started to understand the whole noise(?) around React Native.

<!-- Add mind blowing meme image-->



## NativeBase as an example

NativeBase library is made from pre-build components that help every developer to build stuff faster and *consistent* across all the screens. And buttons are not an exception to this.

They offer a long list of *props* — inputs for the Button component that tell it how to look or to behave - like outlined, transparent, bordered, rounded, large or small.

No more @IBOutlets, no more subclassing, no more "CustomButton" that ate another UIButton :)

> I'm aware that in React Native you end up doing the same thing when implementing your custom styles, but it's nowhere near as easy.



Fast-forward to today, I'm happy that I rediscovered my love to develop beautiful things using SwiftUI.

# 3. SwiftUI buttons

Creating a button in SwiftUI is pretty simple. It requires an action and the actual content displayed and tappable.

```swift
Button(action: {
  //	action on tap - e.g. update a @State variable
}) {
	// content - e.g. Text or Image
}
```

Of course, to style this `Button` view you have to add view modifiers. You have 2 options:

1. apply the modifiers to (each of) the views inside the content 

2. apply the modifiers to the button view - that will apply the modifiers to all the views inside the content

```swift
//	1.
Button(action: {
  //	...
}) {
  Text("Tap me!")
  		.padding()
      .font(.title)
      .background(Color.green)
      .foregroundColor(.white)
}

/*=======================================================================*/

//	2.
Button(action: {
  //	...
}) {
  Text("Tap me!")
}
.padding()
.font(.title)
.background(Color.green)
.foregroundColor(.white)
```

Both will have the same result:

<img src="/Users/calinciubotariu/Library/Application Support/typora-user-images/Screenshot 2020-05-16 at 17.15.56.png" alt="Screenshot 2020-05-16 at 17.15.56" style="zoom:50%;" />



**However**, the difference however can be seen whenever you have multiple views inside the content:

```swift
//	1.
Button(action: { }) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
  .padding()
  .font(.title)
  .background(Color.green)
  .foregroundColor(.white)
}

/*=======================================================================*/

//	2.
Button(action: { }) {
	Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.padding()
.font(.title)
.background(Color.green)
.foregroundColor(.white)
```

As you can see, in the first button the `Image` view is left out — but it's still tappable.

<img src="/Users/calinciubotariu/Library/Application Support/typora-user-images/Screenshot 2020-05-16 at 17.20.45.png" alt="Screenshot 2020-05-16 at 17.20.45" style="zoom:50%;" />

Something to keep in mind:

- like I noted in my [previous blog post](https://www.calincrist.com/blog/2020-05-02-beginners-guide-to-view-modifiers-swiftui/) about view modifiers, usually the order matters 
- `padding` should be (again, usually) put before anything regarding the background or border of the button. Let the button breathe, give it some space. We wouldn't want something like:

<img src="/Users/calinciubotariu/Library/Application Support/typora-user-images/Screenshot 2020-05-16 at 17.31.07.png" alt="Screenshot 2020-05-16 at 17.31.07" style="zoom:50%;" />

- the modifiers regarding fonts and colors are applied here to the `Image` view because it's using the SF Symbol icon (the Apple's equivalent of FontAwesome)

# 4. ButtonStyle modifier

There are 2 types of view modifiers:

1. ##### Modifiers bundled with the View protocol, available to any view: 

   E.g. `padding` or `background` , that you can be apply to any View.



2. ##### Modifiers specific to a type, available only to instances of that type: 

These are used to take advantage of specific traits of that View. And buttons are a perfect example for this. For example we want to change the look&feel whenever the user taps on the button. 

We have `buttonStyle` view modifier that accepts a  `struct` that implements the `ButtonStyle` protocol.

By default, we have 3 pre-defined styles. 

<!-- Talk about these pre-defined styles -->

```swift
/// The default button style.
Button(action: {
  //    ...
}) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.buttonStyle(DefaultButtonStyle())

/// The style may apply a visual effect to indicate the pressed, focused,
/// or enabled state of the button.
Button(action: {
  //    ...
}) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.buttonStyle(PlainButtonStyle())


/// A standard `Button` style that does not apply a border to its content.
Button(action: {
  //    ...
}) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.buttonStyle(BorderlessButtonStyle())
```

<img src="/Users/calinciubotariu/Documents/Projects/gatsby-starter-netlify-cms/static/img/Screenshot 2020-05-16 at 18.03.37.png" alt="Screenshot 2020-05-16 at 18.03.37" style="zoom:50%;" />





# 5. Build your own ButtonStyle modifier



# 6. Theme the buttons



# 6. Conclusion / Where to go from here?



# 7. Useful links



# 8. Call-to-action
