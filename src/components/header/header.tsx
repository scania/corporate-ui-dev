import {
  Component, Prop, State, Element, Watch, Listen,
} from '@stencil/core';

import Stickyfill from 'stickyfilljs';
import { actions } from '../../store';


@Component({
  tag: 'c-header',
  styleUrl: 'header.scss',
  shadow: true,
})
export class Header {
  @Prop({ context: 'store' }) ContextStore: any;

  /** Per default, this will inherit the value from c-theme name property */
  @Prop({ mutable: true }) theme: string;

  /** The site name will be displayed on the right hand side of the logotype on desktop mode */
  @Prop() siteName: string;

  /** A link that will be applied to the site-name */
  @Prop() siteUrl = '/';

  /** Header links that will be placed in the top right part of the header */
  @Prop({ mutable: true }) items: any;

  /** Short name will be displayed in the top-centered of the header on mobile mode */
  @Prop() shortName: string;

  @State() store: any;

  @State() navigationOpen: Boolean;

  @State() navigationSlot = [];

  @State() tagName: string;

  @State() currentTheme: object;

  @State() height = 0;

  @Element() el: HTMLElement;

  @Watch('items')
  setItems(items) {
    this.items = Array.isArray(items) ? items : JSON.parse(items || '[]');
  }

  @Watch('theme')
  setTheme(name) {
    this.theme = name || this.store.getState().theme.name;
    this.currentTheme = this.store.getState().themes[this.theme] || {};
  }

  @Listen('window:scroll')
  handleScroll() {
    const stickyPos = this.el.getBoundingClientRect();

    if (stickyPos.top <= (this.height * -1)) {
      this.el.setAttribute('stuck', 'true');
    } else {
      this.el.removeAttribute('stuck');
    }
  }

  toggleNavigation(open) {
    this.store.dispatch({ type: actions.TOGGLE_NAVIGATION, open });
  }

  componentWillLoad() {
    this.store = this.ContextStore || (window as any).CorporateUi.store;

    this.setTheme(this.theme);
    this.setItems(this.items);

    this.store.subscribe(() => {
      this.setTheme(this.theme);

      this.navigationOpen = this.store.getState().navigation.open;
    });
  }

  componentDidLoad() {
    // To make sure navigation is always hidden from start
    this.toggleNavigation(false);

    if (!this.el) return;

    this.tagName = this.el.nodeName.toLowerCase();

    const elem = document.head.attachShadow ? this.el.shadowRoot.querySelector('slot[name=navigation') : this.el.querySelector('c-navigation');

    if (elem) {
      elem.addEventListener('slotchange', e => this.getNavSlotItems(e.target));
      this.getNavSlotItems(elem);
    }

    setTimeout(() => {
      this.height = (this.el.shadowRoot || this.el).querySelector('.navbar-default').clientHeight;
      this.el.style.top = `${(this.height * -1)}px`;
      Stickyfill.addOne(this.el);
    }, 100);
  }

  getNavSlotItems(node) {
    // node.children is not supported in IE
    this.navigationSlot = document.head.attachShadow ? node.assignedNodes() || node.children : node.childNodes;
  }

  combineClasses(classes) {
    return [
      ...(classes || '').split(' '),
      ...['nav-item', 'nav-link'],
    ].join(' ');
  }

  render() {
    return [

      <style { ...{ innerHTML: `:host { --stickyMargin: ${this.height * -1}px;}` } }></style>,
      this.currentTheme ? <style>{ this.currentTheme[this.tagName] }</style> : '',

      <nav class='navbar navbar-expand-lg navbar-default' short-name={this.shortName}>
        {this.navigationSlot.length
          ? <button
            class='navbar-toggler collapsed'
            type='button'
            onClick={() => this.toggleNavigation(!this.navigationOpen) }>
            <span class='navbar-toggler-icon'></span>
          </button>
          : ''}

        <a href={ this.siteUrl } class='navbar-brand collapse'></a>
        <strong class='navbar-title'>{ this.siteName }</strong>

        <div class='collapse navbar-collapse'>
          <nav class='navbar-nav ml-auto'>
            { this.items.map((item: any) => {
              item.class = this.combineClasses(item.class);
              return <a { ...item }></a>;
            }) }

            <slot name="items" />
          </nav>
        </div>
      </nav>,

      <a href={ this.siteUrl } class='navbar-symbol'></a>,

      <slot name="navigation" />,
    ];
  }
}
