# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]: 🍳
      - heading "Create your account" [level=2] [ref=e7]
      - paragraph [ref=e8]:
        - text: Or
        - link "sign in to your existing account" [ref=e9] [cursor=pointer]:
          - /url: /login
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Full Name
          - textbox "Full Name" [ref=e14]
        - generic [ref=e15]:
          - generic [ref=e16]: Username
          - textbox "Username" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: Email address
          - textbox "Email address" [ref=e20]
        - generic [ref=e21]:
          - generic [ref=e22]: Password
          - textbox "Password" [ref=e23]:
            - /placeholder: Password (min. 6 characters)
      - button "Create account" [active] [ref=e25]
  - button "Open Next.js Dev Tools" [ref=e31] [cursor=pointer]:
    - img [ref=e32]
  - alert [ref=e35]
```