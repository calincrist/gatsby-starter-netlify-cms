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

![Matching text gif](/img/textSync.gif "Matching text gif")

The UI skeleton code:

```swift
struct ContentView: View {
    
    @State var textValue: String = "Hello"
    @State var enteredTextValue: String = ""
    @State var textsMatch: Bool = false
    
    var body: some View {
          VStack {
              HStack {
                  Text("Write this word: ")
                  Text(textValue)
              }

              TextField("Write here:", text: $enteredTextValue)
                  .padding(10)
                  .border(Color.green, width: 1)

              Toggle(isOn: $textsMatch) {
                  Text("Matching?")
              }
              .disabled(true)
              .padding()
        }.padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

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

<br>



What we can do here is enhancing the TextField's init with this param:

```swift
@State var textValue: String = "Hello"
@State var enteredTextValue: String = ""
@State var textsMatch: Bool = false    

var body: some View {
  VStack {
      HStack {
          Text("Write this word: ")
          Text(textValue)
      }

      TextField("Write here:", 
                text: $enteredTextValue,
                onEditingChanged: { changed in
          // UPDATE THE DESIRED @State VARIABLE
          self.textsMatch = (self.textValue == self.enteredTextValue)
      })
      .padding(10)
      .border(Color.green, width: 1)

      Toggle(isOn: $textsMatch) {
          Text("Matching?")
      }
      .disabled(true)
      .padding()
  }.padding()
}
```



<br><br>

## Binding variables

<br><br>

## Combine's `ObservableObject`
