# Corporate UI Beta

The updates from alpha to beta release involve refactored c-navigation component, add styles for bootstrap classes, and refactored icon library.

## Breaking Changes

### Refactored c-navigation component

In alpha version, c-navigation is wrapped inside c-header component and rendered inside a slot. Now in beta release, c-navigation can be declared outside c-header. The new setup separated c-navigation and c-header without dependency to each other. 
The only connection happens in the mobile interaction. Both component subscribed to an event in the store when the hamburger menu is clicked.
See example below to setup header and navigation.

```html
<c-header site-name='Application' short-name='App'>
  <a href='/' slot='items'>global</a>
  <a href='/' slot='items'>scania</a>
</c-header>

<c-navigation>
  <a href='/home' slot='primary-items'>home</a>
  <a href='/about' slot='primary-items' active=''>about</a>

  <c-navigation slot='sub' target='/about' active=''>
    <a href='/about' slot='primary-items' active=''>About 1</a>
    <a href='/about2' slot='primary-items'>About 2</a>
  </c-navigation>
</c-navigation>
```

### Bootstrap 4 styles

Bootstrap 4 has been added as part of scania-theme. To enable the use of bootstrap classes, use c-theme component and set global attribute to true.

```
<c-theme name="scania" global="true"></c-theme>
```

See the progress of each component styles in [scania-theme repository](https://github.com/scania/scania-theme/issues/11).

### Icon component

Icons are available as a component. FontAwesome has been removed from Corporate UI and is replaced by a set of icons that can be used with c-icon components.
The icon library now contains a limited set of icons. More icons will be added to the collection in the future.

### Social media component is deprecated

Social media component has been removed in beta release and replaced with icon component. The example below shows how to render social media icon in footer component.

```html
<c-footer>
  <a href='/' slot='social-items'>
    <c-icon name='youtube'>
  </c-icon></a>
  <a href='/' slot='social-items'>
    <c-icon name='twitter'>
  </c-icon></a>
  <a href='/' target='_blank' slot='social-items'>
    <c-icon name='linkedin'>
  </c-icon></a>

  <a href='/cookies' slot='items'>Cookies</a>
  <a href='/contact-us' target='_blank' slot='items'>Contact us</a>
</c-footer>
```
