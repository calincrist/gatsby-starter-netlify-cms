---
templateKey: blog-post
title: How to theme your SwiftUI app with reusable view modifiers
date: 2020-05-02T07:34:53.476Z
featured_image: /img/Screenshot 2020-05-02 at 13.47.06.png
description: >-
  Maintaining your app's UI consistency while keeping your codebase clean is a
  must-have(?). But how can we achieve that in SwiftUI?
tags:
  - ios
  - swiftui
  - swift
  - theme
---
# Introduction & motivation

Developing a pet/serious project is the perfect way to learn a new framework or paradigm. SwiftUI is no exception to this truth.

While doing that, I stumbled upon having to use the same components on several screens: titles, subtitles and buttons. Having mini-ui-libraries inside the project for different UI building blocks helps a lot.

In SwiftUI I discovered that we don't have to rebuild the existing UI components (e.g. `Text, TextField, Button`), but we can create shared styles through **view modifiers** .

<!--Add image-->

# What are view modifiers?

A *view modifier* is a method of the View instance. It does three things:

* takes the view (or another modifier)
* it makes a copy of the view
* it returns the modified view after applying some changes on its styles. 

If you already tried constructing UI using SwiftUI, there's 99% chances that you've used a view modifier. There are built-in modifiers that help you shaping the screen you're working on.

> For a full list, you can browse the documentation.
>
> In Xcode, **Option-click** View in the source editor, and then click **Open in Developer Documentation**.

The simplest example would be applying paddings or fonts to a `Text` view:

```swift
Text("Cool headline")
    .font(.headline)
		.foregroundColor(.purple)
		.padding()
```

<!-- Add screenshot with the result -->

## Quick note: Ordering modifiers

<!-- Where to put this? -->

That's all great! 

But what if you have several purple headlines throughout the app? Telling texts: "be a purple headline with paddings" every time isn't a pretty solution, is it?

<!--Add meme (yes, you're right/ok, now what)-->

# Custom view modifiers

You might be saying "I'd like to be able to write something like":

```
Text("Cool headline")
		.purpleHeadline()
```

Fortunately, we can create our own modifiers on top of the built-in ones. And we can name them accordingly.

I know you're busy, so here's the code:

```swift
import SwiftUI

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

* create a `struct` that implements the `ViewModifier` protocol
* implement the `func body(content: Content)` function

  * apply all the modifiers you need
  * what it does is it's taking the view (content) and returns it with the applied modifiers
* because we're applying this custom modifier to a View, we can add an extension to it

  * name the function whatever you want
  * make sure it returns `some View`
  * `ModifiedContent` represents a value with a view modifier applied to it

    * specify the content and the custom modifier to apply

Now, writing `Text("Cool headline").purpleHeadline()` will make sense.

# Modifiers with parameters

Customizing your custom modifiers? Maybe with some values as parameters? I thought you wouldn't ask!

<!-- Add image/meme. Smth. about more customization -->

Of course, our custom view modifiers can take parameters. What we have to do is to specify them in the `init` method.

For example, let's create another custom modifier that adds borders to a view. And on top of that, specify the border width and radius.

```swift
import SwiftUI

struct BorderedViewModifier: ViewModifier {
    
    var borderWidth: CGFloat = 0
    var borderRadius: CGFloat = 0
    
    init(borderWidth: CGFloat, borderRadius: CGFloat) {
        self.borderWidth = borderWidth
        self.borderRadius = borderRadius
    }
    
    func body(content: Content) -> some View {
        content
            .overlay(
                RoundedRectangle(cornerRadius: borderRadius)
                    .stroke(lineWidth: borderWidth)
        )
    }
}

extension View {
    func bordered(borderWidth: CGFloat = 1, borderRadius: CGFloat = 0) -> some View {
        ModifiedContent(
            content: self,
            modifier: BorderedViewModifier(
                borderWidth: borderWidth,
                borderRadius: borderRadius
            )
        )
    }
}
```

At the end of the day, the view modifier is just a `struct`, so we can make use of stored properties.  In this example we're using the `borderRadius` and `borderWidth` to customize the overlay.

Usage: 

```swift
Text(subtitleText)
    .purpleHeadline()
		.bordered(borderWidth: 3, borderRadius: 5)
```

<!-- Add screenshot -->

Below is another blog post, related to the one above:

# Conclusion / Where to go from here?

# Useful links

# Call-to-action
