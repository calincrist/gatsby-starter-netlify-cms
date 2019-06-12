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

## AWS Amplify

AWS Amplify is an open source library for developers that want to integrate the powerful AWS services (Auth, API, S3 Storage, etc.) into their mobile/web apps.

It has a great strength: you need no über-strong backend knowledge to deploy and integrate. By using this, you can focus more on building your app than configuring.

## Auth

> "AWS Amplify Authentication module provides Authentication APIs and building blocks for developers who want to create user authentication experiences." 
>
> <https://aws-amplify.github.io/docs/js/authentication>

It has a great strength: you need no über-strong backend knowledge to deploy and integrate. By using this, you can focus more on building your app than configuring.

## What/How

What I have planned is to create a basic iOS app and to add authentication flows to it:

* login
* sign up
* reset password

To be easier to understand, here's a diagram:

![flow](/img/b6feabe3d8a04618ae9301b767233aa5.png "App flow sketch")



## Create basic iOS app project

I created a SingleView Swift project and called it _aws_amplify_integration_.

![project template](/img/screenshot_2019-05-18_at_16.51.21.png "SingleView Project template")
