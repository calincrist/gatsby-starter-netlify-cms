---
templateKey: blog-post
title: How to theme your SwiftUI buttons with reusable buttonstyles
date: 2020-05-02T07:34:53.476Z
featured_image: /img/Screenshot 2020-05-02 at 13.47.06.png
description: How to theme your SwiftUI buttons with reusable buttonstyles
tags:
  - ios
  - swiftui
  - buttons
  - theme
---
# Subtitle

Maintaining your app's UI consistency while keeping your codebase clean is a must-have(?). But how can we achieve that in SwiftUI?

# 1. Introduction & motivation

Developing a pet/serious project is the perfect way to learn a new framework or paradigm. SwiftUI is no exception to this truth.

While doing that, I stumbled upon having to use the same components on several screens: titles, subtitles and buttons. Having mini-libraries inside the iOS project for different UI building blocks helps a lot.

In SwiftUI I discovered that we don't have to rebuild the existing UI components (e.g. `Text, TextField, Button`), but we can create shared styles through **view modifiers** .

<!--Add image-->

# 2. What are view modifiers?

A *view modifier* is basically a method of the `View` instance that takes the view (or another modifier), makes a copy of it and returns the modified view after applying some changes on its styles. 

If you already tried constructing UI using SwiftUI, there's 99% chances that you used a view modifier. There are built-in modifiers that quickly help you shaping the screen you're working on.

> For a full list, you can browse the documentation; in Xcode, **Option-click** View in the source editor, and then click **Open in Developer Documentation**.

The simplest example would be applying paddings or fonts to a `Text` view:

```swift
Text("Cool headline")
    .font(.headline)
		.foregroundColor(.purple)
		.padding()

```



## Quick note: Ordering modifiers

<!-- Where to put this? -->



That's all great! 

But what if you have several purple headlines throughout the app? Telling texts "be a purple headline with paddings" every time isn't a pretty solution, isn't it?

<!--Add meme (yes, you're right)-->

# 3. Simple custom view modifiers

I'd like to be able to write something like:

```
Text("Cool headline")
		.purpleHeadline()
```



Fortunately, we can create our own modifiers on top of the built-in ones. And we can name them accordingly.

I know you're busy, so here's the code:

```swift
struct HeadlineViewModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.headline)
            .foregroundColor(.purple)
            .padding()
    }
}

extension View {
    func purpleHeadline() -> some View {
        ModifiedContent(
            content: self,
            modifier: HeadlineViewModifier()
        )
    }
}
```

Explanations:

- create a `struct` that implements the `ViewModifier` protocol
- implement the `func body(content: Content)` function
  - what it does is it's taking the view (content) and returns it with the applied modifiers
- because we're applying this custom modifier to a View, we can add an extension to it
  - name the function whatever you want
  - make sure it returns `some View`
  - 

# 4. SwiftUI buttons

- Modifiers bundled with the View protocol, available to any view.
- Modifiers specific to a type, available only to instances of that type.

# 5. ButtonStyle view modifier



# 6. Build your own ButtonStyle modifier



# 7. Theme the buttons



# 8. Conclusion / Where to go from here?



# 9. Useful links



# 10. Call-to-action



