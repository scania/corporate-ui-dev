import { Component, Prop, State, Element, Watch } from '@stencil/core';

import { store } from '../../global';
import * as themes from '../../tmp/c-footer';

@Component({
  tag: 'c-footer',
  styleUrl: 'footer.scss',
  shadow: true
})
export class Footer {
  @Prop() theme: string;
  @Prop() items: any = [];

  @State() currentTheme: string = this.theme || store.getState().theme.name;
  @State() show = false;
  // There should be a better way of solving this, either by "{ mutable: true }"
  // or "{ reflectToAttr: true }" or harder prop typing Array<Object>
  @State() _items: object[] = [];
  @State() itemsSlot: any;

  @Element() el: HTMLElement;

  @Watch('items')
  setItems(items) {
    this._items = Array.isArray(items) ? items : JSON.parse(items);
  }

  @Watch('theme')
  updateTheme(name) {
    this.currentTheme = name;
  }

  componentWillLoad() {
    store.subscribe(() => this.currentTheme = store.getState().theme.name);

    this.setItems(this.items);
  }

  componentDidLoad() {
    const elem = this.el.shadowRoot.querySelector('slot[name=navigation');
    elem.addEventListener('slotchange', e => this.getNavSlotItems(e.target) );

    this.getNavSlotItems(elem);
  }

  getNavSlotItems(node) {
    this.itemsSlot = (node.assignedNodes() || node.children || [])[0];
  }

  render() {
    return [
      this.currentTheme ? <style>{ themes[this.currentTheme] }</style> : '',

      <nav class='navbar navbar-expand-lg navbar-default' data-test-id='c-footer'>
        <strong class='navbar-brand' data-test-id='c-footer-logo'></strong>

        <div class="navigation dropup">
          <div class={'collapse navbar-collapse' + (this.show ? ' show' : '')}>
            <nav class='navbar-nav'>
              { this._items.map(item => (
                <a href={ item['location'] } class='nav-item nav-link'>
                  <span>{ item['text'] }</span>
                </a>
              )) }

              <slot name="items" />
            </nav>
          </div>

          {this.items || this.itemsSlot ?
            <button
              class='navbar-toggler collapsed btn btn-link dropdown-toggle'
              type='button'
              onClick={() => this.show = !this.show }>
              Scania
            </button>
          : ''}
        </div>

        <p data-test-id='c-footer-copyright'>Copyright &copy; Scania 2019</p>
      </nav>
    ];
  }
}
