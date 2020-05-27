---
templateKey: blog-post
title: Build your own button component library in SwiftUI from scratch
date: 2020-05-12T17:31:18.901+00:00
featured_image: "/img/diomari-madulara-FFZjSpUwc_I-unsplash.jpg"
description: Create a UI library for you buttons. Your app needs it!
tags:
- ios
- swiftui
- swift
- button

---
# Introduction

Buttons are the UI components that people use to interact with your app. It's important to make them look appropriate to the action they trigger, to be consistent and accessible across the app and to give visual feedback to users.

In the [previous blog post](https://www.calincrist.com/blog/2020-05-02-beginners-guide-to-view-modifiers-swiftui/) I talked about what are view modifiers and how can we use them to create stylish UI in our SwiftUI apps.

Here I will present how to apply them to create reusable styles for buttons. It's going to be a long and enjoyable ride.

![buckle up image](/img/buckleup-630x315.jpg "buckle up")

# <br>

# SwiftUI buttons

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
Button(action: { }) {
  Text("Tap me!")
  	  .padding()
      .font(.title)
      .background(Color.green)
      .foregroundColor(.white)
}

/*=======================================================================*/

//	2.
Button(action: { }) {
  Text("Tap me!")
}
.padding()
.font(.title)
.background(Color.green)
.foregroundColor(.white)
```

Both will have the same result:![button with "Tap me" caption](/img/Screenshot 2020-05-16 at 17.15.56.png 'button with "Tap me" caption')

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

![comparison between buttons with different styles](/img/Screenshot 2020-05-16 at 17.20.45.png "comparison between buttons with different styles")

Something to keep in mind:

* like I noted in my [previous blog post](https://www.calincrist.com/blog/2020-05-02-beginners-guide-to-view-modifiers-swiftui/) about view modifiers, usually the order matters
* `padding` should be (again, usually) put before anything regarding the background or border of the button. Let the button breathe, give it some space. We wouldn't want something like:

![comparison between buttons with different styles](/img/Screenshot 2020-05-16 at 17.31.07.png "comparison between buttons with different styles")

* the modifiers regarding fonts and colors are applied here to the `Image` view because it's using the SF Symbol icon (the Apple's equivalent of FontAwesome)

<br>

# ButtonStyle modifier

There are 2 types of view modifiers:

1. **Modifiers bundled with the View protocol, available to any view:**

E.g. `padding` or `background` , that you can be apply to any View.

1. **Modifiers specific to a type, available only to instances of that type:**

These are used to take advantage of specific traits of that View. And buttons are a perfect example for this. For example we want to change the look&feel whenever the user taps on the button.

We have `buttonStyle` view modifier that accepts a  `struct` that implements the `ButtonStyle` protocol.

By default, we have 3 pre-defined styles.

<!-- Talk about these pre-defined styles -->

```swift
/// The default button style.
Button(action: { }) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.buttonStyle(DefaultButtonStyle())

/// The style may apply a visual effect to indicate the pressed, focused,
/// or enabled state of the button.
Button(action: { }) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.buttonStyle(PlainButtonStyle())


/// A standard `Button` style that does not apply a border to its content.
Button(action: { }) {
  Image(systemName: "square.and.arrow.down")
  Text("Tap me!")
}
.buttonStyle(BorderlessButtonStyle())
```

![3 buttons with 3 pre-defined styles](/img/Screenshot 2020-05-16 at 18.03.37.png "3 buttons with 3 pre-defined styles")

But what if we would want to customise further our buttons? Like change the opacity when the button is pressed?

That's where the `ButtonStyle` protocol comes in.

<br>

# Build your own ButtonStyle modifier

As I was stating before, the view modifier specific to buttons gives us access to specific traits. This is done through the `Configuration`(which is in fact a `typealias Configuration = ButtonStyleConfiguration`).

What we can access are:

* `label` - the button content as a whole view
* `isPressed` - a Bool var that becomes `true` whenever the button is pressed

Let's do a more interesting example: when the button is pressed, scale it down and decrease the opacity to give it a highlight effect. And as a bonus, animate these changes.

```swift
//	CustomButtonStyle
import SwiftUI

struct CustomButtonStyle: ButtonStyle {
    func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
            .padding()
            .background(Color.green)
            .foregroundColor(Color.white)
            .opacity(configuration.isPressed ? 0.7 : 1)
            .scaleEffect(configuration.isPressed ? 0.8 : 1)
            .animation(.easeInOut(duration: 0.2))
    }
}


//	USAGE:
Button(action: { }) {
  Text("This is a custom button")
}
.buttonStyle(CustomButtonStyle())
```

And the result:

![button with custom style and animation](/img/custombuttonstyle.gif "button with custom style and animation")

<br>

# React Native UI libraries

### Short backstory

In 2019 I started a "sabbatical" year and a half from native iOS development. I started to develop mobile apps using React Native as my main job.

I learned a lot, but what amazed me was the power to quickly prototype apps with existing UI libraries. Where I came from (the native development world) that wasn't even a thought.

What I used back then was [Callstack's React Native Paper (material design)](https://callstack.github.io/react-native-paper/) and then [NativeBase](https://nativebase.io).

Import, use and still customise was mind blowing to me. I started to understand the power and noise around React Native.

![mind blown gif](/img/tenor.gif "mind blown gif")

<br>

## NativeBase as an example

NativeBase library is made from pre-build components that help every developer to build stuff faster and _consistent_ across all the screens. And buttons are not an exception to this.

They offer a long list of [_props_](https://docs.nativebase.io/Components.html#button-def-headref) — inputs for the Button component that tell it how to look or to behave - like outlined, transparent, bordered, rounded, large or small.

No more @IBOutlets, no more subclassing, no more "CustomButton" that ate another UIButton :)

> I'm aware that in React Native you end up doing the same thing when implementing your custom styles, but it's nowhere near as easy using UIKit.

Fast-forward to today, I'm happy that I rediscovered my love to develop beautiful things using SwiftUI.

Let's see how can we develop a themed UI library for our buttons similar to the ones from NativeBase.

![nativebase buttons](/img/Screenshot 2020-05-26 at 15.16.31.png "nativebase buttons")

<br>

# Create a UI library

Below I summarise how are the buttons described based on the NativeBase examples.

* Types: light, primary, success, info, warning, danger, dark
* Styles:
  * default (color fill),
  * transparent,
  * outline
  * rounded (color fill)
  * full width
* States: enabled(by default), disabled
* Sizes: small, default, large (font sizes)

<br>

What I wanted to achieve is to be as close as possible as declaring:

```html
<Button rounded success>
  <Text>Success</Text>
</Button>
```

So it would be something like this with all the variables in place:

```swift
Button(action: { }) {
  Text(primaryButtonText)
}
.buttonStyle(
  NativeBaseLikeButtonStyle(
    .rounded(type: .primary),
    size: .small,
    disabled: false,
    isFullWidth: true,
  )
)
```

Now, looking at these requirements and the native base examples, we can see there are common traits that describe this UI:

* foreground color - the text color
* background color
* border color - for outlined buttons
* border radius - for both default and rounded buttons
* border width

### <br>

### Button style configuration

So let's create a protocol called `ButtonStyleConfig`.

```swift
protocol ButtonStyleConfig {
    var foregroundColor: Color? { get }
    var backgroundColor: Color? { get }
    var borderColor: Color { get }
    var borderWidth: CGFloat { get }
    var cornerRadius: CGFloat { get }
}

extension ButtonStyleConfig {
    var borderColor: Color {
        Color.clear
    }
    
    var borderWidth: CGFloat {
        0
    }
    
    var cornerRadius: CGFloat {
        6
    }
}
```

Looking on the designs, we can see that most of them buttons have no border and the same corner radius. As an arbitrary value, I chose 6 for corner radius.

Another thing that we can notice is that no matter what type of buttons there are, all of them have 2 colors: a primary and a secondary one. For example, for the default success button we have the primary color green and the secondary color white. In fact most of them have the secondary color white, so let's make that the default value.

```swift
protocol AccentColoured {
    static var primaryColor: Color?  { get }
    static var secondaryColor: Color? { get }
}

extension AccentColoured {
    static var secondaryColor: Color? {
        Color.white
    }
}
```

Now, let's create specific structs that describe each color for each style:

```swift
struct PrimaryStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        Color.blue
    }
}

struct SuccessStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        Color.green
    }
}

struct InfoStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        return Color.blue.opacity(0.6)
    }
}

struct LightStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        return Color.gray.opacity(0.2)
    }
    static var secondaryColor: Color? {
        Color.blue
    }
}

struct WarningStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        return Color.orange
    }
}

struct DangerStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        return Color.red
    }
}

struct DarkStyleConfig: AccentColoured {
    static var primaryColor: Color? {
        return Color.black
    }
}
```

> Of course, there are a lot of ways of doing this instead of using structs, like plist or JSON files.

Let's make the styles easier to use and create an enum for them:

```swift
enum ButtonStyles {
    case primary, light, success, info, warning, danger, dark
    
    var secondaryColor: Color? {
        switch self {
        case .light:
		    return LightStyleConfig.secondaryColor
            
        case .primary:
            return PrimaryStyleConfig.secondaryColor
            
        default:
            return Color.white
        }
    }
    
    var primaryColor: Color? {
        switch self {
        case .primary:
            return PrimaryStyleConfig.primaryColor
            
        case .light:
            return LightStyleConfig.primaryColor
            
        case .success:
            return SuccessStyleConfig.primaryColor
            
        case .info:
            return InfoStyleConfig.primaryColor
            
        case .warning:
            return WarningStyleConfig.primaryColor
            
        case .danger:
            return DangerStyleConfig.primaryColor
            
        case .dark:
            return DarkStyleConfig.primaryColor
        }
    }
}
```

### <br>

### Display styles

Now let's use an enum to describe the display styles: default, transparent, outline and rounded and to specify the button style configurations by implementing the `ButtonStyleConfig` protocol.

As you can see, having the type returning the primary and secondary colors helps us a lot when switching these for the transparent/outline styles.

```swift
enum DisplayStyle: ButtonStyleConfig {
    
    case `default`(type: ButtonStyles = .primary)
    case transparent(type: ButtonStyles = .primary)
    case outline(type: ButtonStyles = .primary)
    case rounded(type: ButtonStyles = .primary)
    
    var foregroundColor: Color? {
        switch self {
        case .default(let type):
            return type.secondaryColor
            
        case .transparent(let type):
            return type.primaryColor
            
        case .outline(let type):
            return type.primaryColor
            
        case .rounded(let type):
            return type.secondaryColor
        }
    }
    
    var backgroundColor: Color? {
        switch self {
        case .default(let type):
            return type.primaryColor
            
        case .transparent(let type):
            return type.secondaryColor
            
        case .outline(let type):
            return type.secondaryColor
            
        case .rounded(let type):
            return type.primaryColor
        }
    }
    
    var borderColor: Color {
        if case .outline(let type) = self {
            return type.primaryColor ?? Color.clear
        }
        
        return Color.clear
    }
    
    var cornerRadius: CGFloat {
        if case .rounded(_) = self {
            return 40
        }
        
        return 6
    }
}
```

<br>

Is there something we missed? Oh, yes, the size of the button, that is in fact the font size. So we can create a simple enum:

```swift
enum Size {
    case `default`, small, large
    
    func getFont() -> Font {
        switch self {
        case .small:
            return Font.caption
        case .large:
            return Font.title
        default:
            return Font.body
        }
    }
}
```

<br>

With all these components, we can start creating our custom button styles.

![](/img/giphy.gif)

<br>

# Theme the buttons

Let's use the CustomButtonStyle we created earlier and add a custom init. Like I described in the [previous blog post](https://www.calincrist.com/blog/2020-05-02-beginners-guide-to-view-modifiers-swiftui/) we can pass parameters to our custom view modifier.

```swift
struct CustomButtonStyle: ButtonStyle {

  private var display: DisplayStyle
  private var font: Font
  
  init(_ display: DisplayStyle = .default(type: .primary),
         size: Size = .default) {
        
        self.display = display
        font = size.getFont()
    }
  
    func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
            .padding()
			.font(font)
            .background(display.backgroundColor)			//	<---
            .foregroundColor(display.foregroundColor)	//	<---
            .cornerRadius(display.cornerRadius)				//	<---
            .opacity(configuration.isPressed ? 0.7 : 1)
            .shadow(color: display.backgroundColor!.opacity(0.2),
                radius: display.cornerRadius,
                x: 0,
                y: 5)
    }
}
```

As a subtle touch, I added a shadow component to give the buttons a little depth.

<br>

Let's see it in action:

* this is how it looks by default: `.buttonStyle(CustomButtonStyle())`

![default primary style](/img/Screenshot 2020-05-19 at 21.56.08.png "default primary style")

* `CustomButtonStyle(.rounded(type: .success))`

![rounded success button style](/img/Screenshot 2020-05-19 at 21.55.40.png "rounded success button style")

* `CustomButtonStyle(.transparent(type: .success)`

![transparent success button style](/img/Screenshot 2020-05-19 at 21.57.16.png "transparent success button style")

* `CustomButtonStyle(.outline(type: .success))`

![failed outlined success button style](/img/Screenshot 2020-05-19 at 21.57.16.png "failed outlined success button style")

**Wait, what? Shouldn't it be outlined? But where's the border? Let's fix it!**

### <br>

### Borders

Let's fix it! We can add the border by adding a `RoundedRectangle` as an overlay view:

```swift
func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
            .padding()
            .font(font)
            .background(display.backgroundColor)			
            .foregroundColor(display.foregroundColor)	
            .cornerRadius(display.cornerRadius)				
            .opacity(configuration.isPressed ? 0.7 : 1)
            .shadow(color: display.backgroundColor!.opacity(0.2),
                radius: display.cornerRadius,
                x: 0,
                y: 5)
            .overlay(
              RoundedRectangle(cornerRadius: display.cornerRadius)	//	<---
              .stroke(display.borderColor, lineWidth: 1)
            )
}
```

The outlined style it's fixed!

![fixed outlined success button style](/img/Screenshot 2020-05-19 at 22.02.56.png "fixed outlined success button style")

<br>

### What we achieved until now

Let's see what we can do until now:

![buttons with basic animations](/img/buttons_without_animations.gif "buttons with basic animations")

<br>

### Full width

Right now, our buttons take the minimum width needed. But what if we want to use a submit button for our form and want it to take the full width available?

**How:**

To make a view take the full width available, we can use the `.frame` view modifier like this:

`.frame(maxWidth: .infinity)`.

**Where**:

In the previous blog post I emphasised that the order of modifiers matters.

What we want to achieve is not only a full width. We want make the corners, backgrounds, shadows and overlays impact the entire view and keep the proportions.

To do that we need to specify the `frame` before the `background` modifier.

```swift
struct CustomButtonStyle: ButtonStyle {
  //	...
  func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
            .frame(maxWidth: .infinity)	//	<---
            .padding()
            .font(font)
            .background(display.backgroundColor)
            .foregroundColor(display.foregroundColor)
            .cornerRadius(display.cornerRadius)
            .opacity(configuration.isPressed ? 0.7 : 1)
            .shadow(color: display.backgroundColor!.opacity(0.2),
                    radius: display.cornerRadius,
                    x: 0,
                    y: 5)
            .overlay(
              RoundedRectangle(cornerRadius: display.cornerRadius)
              .stroke(display.borderColor, lineWidth: 1)
            )
  }
}
```

And the result is this:

![full width buttons](/img/Screenshot 2020-05-20 at 11.16.44.png "full width buttons")

<br>

Now, this is not something I always want. I would like to specify that through a boolean, something like: `CustomButtonStyle(.default(type: .dark), isFullWidth: true)` .

So, specify the flag in the `init` method and apply the `frame` modifier only if it's true in the `makeBody` method.

```swift
struct CustomButtonStyle: ButtonStyle {
  //	...
  private var isFullWidth: Bool	//	<---
  
  init(_ display: DisplayStyle = .default(type: .primary),
         size: Size = .default,
         isFullWidth: Bool = false) {
	
        self.isFullWidth = isFullWidth	//	<---
        // ...
  }
}
```

If we're here, let's create a small custom modifier that's making a view to have full width.

```swift
struct FullWidthModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .frame(maxWidth: .infinity)
    }
}
```

<br>

Unfortunately at this moment, there isn't a method to conditionally apply a modifier. But we can create it!

Googling about this issue, we find this excellent [article on view modifiers](https://swiftui-lab.com/view-extensions-for-better-code-readability/). There we can find a very useful extension that applies a specified modifier only if the condition is true.

```swift
extension View {
    // If condition is met, apply modifier, otherwise, leave the view untouched
    public func applyModifier<T>(if condition: Bool, _ modifier: T) -> some View where T: ViewModifier {
        Group {
            if condition {
                self.modifier(modifier)
            } else {
                self
            }
        }
    }
}
```

Now we have all the building blocks we need:

```swift
func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
            .applyModifier(if: isFullWidth, FullWidthModifier()) // <---
            .padding()
            .font(font)
            .background(display.backgroundColor)
            .foregroundColor(display.foregroundColor)
  					// ...
}
```

As an example of usage, let's see it applied to the same button:

```swift
//  Dark themed button
Button(action: {}) {
  Text("Dark")
}
.buttonStyle(CustomButtonStyle(.default(type: .dark), isFullWidth: false))

//  Dark themed button full width
Button(action: {}) {
  Text("Dark")
}
.buttonStyle(CustomButtonStyle(.default(type: .dark), isFullWidth: true))
```

![default and block dark buttons](/img/Screenshot 2020-05-20 at 11.39.31.png "default and block dark buttons")

<br>

### Crazy animations

As you can see, the only way we indicate the buttons are pressed is through a highlight effect: `.opacity(configuration.isPressed ? 0.7 : 1)`.

Let's add back the `scaleEffect` modifier, but this time change the animation effect to make it bounce. And to make it even crazier let's change the radius when it's pressed:

```swift
func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
            .padding()
            .font(font)
            .background(display.backgroundColor)
            .foregroundColor(display.foregroundColor)
            .cornerRadius(display.cornerRadius)
            .opacity(configuration.isPressed ? 0.7 : 1)
            .shadow(color: display.backgroundColor!.opacity(0.2),
                    radius: display.cornerRadius,
                    x: 0,
                    y: 5)
            .overlay(
                RoundedRectangle(cornerRadius:display.cornerRadius)
                    .stroke(display.borderColor, lineWidth: 1)
            )
            .scaleEffect(configuration.isPressed ? 0.8 : 1)
            .animation(
              Animation.spring(response: 0.8, 
                               dampingFraction: 0.1, 
                               blendDuration: 10)
            )
    }
```

**Voilà!**

![buttons with animations](/img/buttons_with_animations.gif "buttons with animations")

Do we really need that in a real-life scenario? Most probably not but we need to animate our lives sometimes :)

<br>

# Conclusion

Congratulations! You made it this far and the reward is your own button component library that's easy to extend and customise. For example, what you can do is to enhance the button component to support loading states, displaying a spinner, making the button untappable.

<br>

# Useful links

* \[https://swiftui-lab.com/view-extensions-for-better-code-readability/\](<* https://swiftui-lab.com/view-extensions-for-better-code-readability/>)
* \[The begginer's guide to view modifiers\](<* https://www.calincrist.com/blog/2020-05-02-beginners-guide-to-view-modifiers-swiftui/>) <!-- change this on medium or dev.to -->

<br>

# Follow me

If you enjoy what I write, please follow my activity wherever you prefer: [Dev.to](https://dev.to/calin_crist), [Medium](https://medium.com/@calin_crist) or on my very own gatsby powered blog [calincrist.com](https://www.calincrist.com/).

Follow me on [Twitter](https://twitter.com/calin_crist) if you want to have a chat or simply see what I'm up to. I try to post something there every day.