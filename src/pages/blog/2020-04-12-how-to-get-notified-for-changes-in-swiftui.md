---
templateKey: blog-post
title: How to get notified for changes in SwiftUI
date: 2020-04-12T15:06:04.644Z
featured_image: /img/swiftui-96x96_2x.png
description: How to implement an equivalent of "onChange" on SwiftUI controls.
tags:
  - swiftui
  - ios
  - textfield
  - state
  - observable
---
After almost a year since **SwiftUI** was released, I decided to give it a go. I started to get my hands dirty by implementing basic UI controls (like Slider or TextField) and how to manipulate view states.

In short time, I faced the challenge to update a `@State`variable based on another `@State` variable changes. 

After some research (took longer than I expected), I learned 3 ways to do that:

1. UI Controls specific callbacks: `onEditingChanged`
2. Binding variables
3. Making use of `Combine` framework `ObservableObject`

<br><br>

Below I will describe a specific simple use-case: check if a text field value is matching a predefined word and show that by toggling a switch on/off (the control is called `Toggle`).

<br><br>

## `onEditingChanged`

According to Apple's Developer Documentation, this callback is available on the inits of 3 controls: `TextField`, `Slider` and `Stepper`.

```swift
TextField:
init(_:text:onEditingChanged:onCommit:)
```

```swift
Slider:
init(value:in:onEditingChanged:)
```

```swift
Stepper:
init(_:onIncrement:onDecrement:onEditingChanged:)
```






## Binding variables

## Combine's `ObservableObject`
