---
templateKey: blog-post
title: Three ways to react to @State event changes in SwiftUI
date: 2020-04-12T15:06:04.644Z
featured_image: /img/onchange-swiftui-headerimage.png
description: >-
  ... or how I learned to implement an equivalent of "onChange" on SwiftUI
  controls.
tags:
  - swiftui
  - ios
  - textfield
  - state
  - observable
---
After almost a year since **SwiftUI** was released, I decided to give it a go. I started to get my hands dirty by implementing basic UI controls (like Slider or TextField) and how to manipulate view states.

In short time, I faced the challenge to update a `@State` variable based on another `@State` variable changes. 

<br>

And yes, the property observers that we know (like `didSet` or `willSet`) don't work in @State variables.

![disappointed](/img/D9b0wcKW4AMxXpn.jpg "Disappointed")

<br>

After some research (took longer than I expected), I learned 3 ways to do that:

1. UI Controls specific callbacks: `onEditingChanged`
2. Binding variables
3. Making use of `Combine` framework `ObservableObject`

<br>

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

<br>

## onEditingChanged

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

//  ADD THIS
func checkIfTextsMatch(changed: Bool) {
    self.textsMatch = self.textValue == self.enteredTextValue
}

var body: some View {
  VStack {
      HStack {
          Text("Write this word: ")
          Text(textValue)
      }

      TextField("Write here:", 
                text: $enteredTextValue,
                //  USE HERE
                onEditingChanged: self.checkIfTextsMatch)
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

A possible downside to this approach is that `onEditingChanged` gets called after the user presses the `return` key of the keyboard. 

But if you don't want this to happen in "real-time" it's a viable solution.

<br>

## Binding variables

`Binding` is a property wrapper type that can read and write a value owned by a source of truth.

This reference enables the view to edit the state of any view that depends on this data.

We can use this to mimic the property observers from UIKit approach (getters/setters).

<br>

```swift
func checkIfTextsMatch() {
    self.textsMatch = self.textValue == self.enteredTextValue
}

var body: some View {
  let textValueBinding = Binding<String>(get: {
      self.enteredTextValue
  }, set: {
      self.enteredTextValue = $0
      self.checkIfTextsMatch()
  })

  return VStack {
      HStack {
          Text("Write this word: ")
          Text(String(textValue))
      }

      TextField("Write here:", text: textValueBinding)
          .padding(10)
          .border(Color.green, width: 1)
      Text(enteredTextValue)

      Toggle(isOn: $textsMatch) {
          Text("Matching?")
      }
      .disabled(true)
      .padding()
  }.padding()
}
```

<br>

I have to say that I don't particularly like this method as it doesn't look clean to declare bindings and have implementation inside the rendering section. 

<br>

## Combine framework

The \`Combine\` framework is used to customise handling of asynchronous events by combining event-processing operators - in our case to listen to state changes events.

In Combine's vocabulary we have:

\- `ObservableObject` - A type of object with a publisher that emits before the object has changed.

\- `ObservedObject`  - declares dependency on a reference type that conforms to the ObservableObject protocol. It's a property wrapper type that subscribes to an observable object and invalidates a view whenever the observable object changes.

What that means is that it will emit just before changes.

\- `Published`  - A type that publishes a property marked with an attribute.

This approach is forcing us (in a good way) to have a cleaner code by extracting the business logic out of the view.

<br>

Create the view model:

```swift
class ContentViewModel: ObservableObject {
    @Published var textValue: String = "Hello"
    @Published var enteredTextValue: String = "" {
        didSet {
            textsMatch = (enteredTextValue == textValue)
        }
    }
    @Published var textsMatch: Bool = false
}
```

<br>

Use it in the desired view:

```swift
struct ContentView: View {
  
  @ObservedObject var viewModel = ContentViewModel()
  
  var body: some View {
      VStack {
          HStack {
              Text("Write this word: ")
              Text(String(viewModel.textValue))
          }

          TextField("Write here:", text: $viewModel.enteredTextValue)
              .padding(10)
              .border(Color.green, width: 1)
          Text(viewModel.enteredTextValue)

          Toggle(isOn: $viewModel.textsMatch) {
              Text("Matching?")
          }
          .disabled(true)
          .padding()
      }.padding()
  }
  
}
```

<br>

I don't know about you, but I have to say that I much prefer the third option as I have more control over the data flow and the code is more maintainable. And I need that in the real-world use cases.

<br><br>
