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

In SwiftUI we can use the existing UI components (e.g. `Text, TextField, Button`) with our own shared styles through **view modifiers** .

<!--Add image-->

# What are view modifiers?

A *view modifier* is a method of the View instance. What it does is:

* takes the view (or another modifier)
* makes a copy of the view
* returns the modified view after applying some changes on its styles. 

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

# Ordering modifiers

A thing to keep in mind is that sometimes the order you apply the view modifiers impacts the UI outcome.

And sometimes it doesn't.

In our example,

```swift
Text("Cool headline")
    .font(.headline)          // <--
		.foregroundColor(.purple) // <--
		.padding()
```

and

```swift
Text("Cool headline")
		.foregroundColor(.purple) // <--
    .font(.headline)          // <--
		.padding()
```

have the same outcome (illustrated in the last image). "Use headline font and make it purple" = "Make it purple and use headline font"



But if you want to add a background color that's a different story.

Below you add an orange background and then some padding.

```swift
Text("Cool headline")
		.foregroundColor(.purple)
    .font(.headline)
    .background(Color.orange) // <--
		.padding()                // <--
```

<!-- Add screenshot -->



Here you add padding and then an orange background.

```swift
Text("Cool headline")
		.foregroundColor(.purple)
    .font(.headline)
		.padding()                // <--
		.background(Color.orange) // <--
```

<!-- Add screenshot -->



Explanation time:

`.padding()` is a modifier that adds spacing around the view. Here it is called without parameters so SwiftUI is adding a default padding on the top, left, bottom and right sides.

```swift
func padding(_ edges: Edge.Set = .all, _ length: CGFloat? = nil) -> some View
//	OR
func padding(_ insets: EdgeInsets) -> some View
```

Without parameters, SwiftUI adds a default padding in all four directions, but you can configure that padding yourself. Example:

```swift
Text("Cool headline")
		.padding(EdgeInsets(top: 10, leading: 5, bottom: 10, trailing: 5))
```



On the first example, first the background color is applied and then the spacing.

On the second example, when you apply the `padding` first, the background color is applied on a different enlarged view.

To illustrate things better try adding background colors before and after padding.

```swift
Text("Cool headline")
		.foregroundColor(.purple)
    .font(.headline)
    .background(Color.red) // <--
		.padding()
		.background(Color.orange) // <--
```

<!-- Add screenshot -->

The padding adds some space between the text and the edges of the view. The red background color is applied to the view that contains just the text and nothing more. The padding modifier results in a new view and the orange background is applied to it.

[^Quick tip]: you can use this approach to visually debug more complex previews (for example to check:  paddings, borders, positioning, etc).



# Custom view modifiers

That's all great! 

But what if you have several purple headlines throughout the app? Telling texts: "be a purple headline with paddings" every time isn't a pretty solution, is it?

<!--Add meme (yes, you're right/ok, now what)-->

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

# Conclusion / Where to go from here?

You shouldn't refrain from using as many modifiers as you need. There are plenty of options like size, weight, overlay, cornerRadius that you can use to modify how your UI controls look on the screen.

For the most time you won't remember modifiers and their signature. That's why you should use the documentation. Always use Apple Docs, so I'll write again: in Xcode, **Option-click** on any view in the source editor, and then click **Open in Developer Documentation**.



In the next blog post I'll discuss about applying view modifiers on buttons and how can we start having a mini-ui-library suited for a SwiftUI project. Stay close!

# Call-to-action

If you enjoy what I write, please follow my activity wherever you prefer: [Dev.to](https://dev.to/calin_crist), [Medium](https://medium.com/@calin_crist) or on my very own gatsby powered blog [calincrist.com](https://www.calincrist.com).

If you want to have a chat or simply see what I'm up to, follow me on [Twitter](https://twitter.com/calin_crist).