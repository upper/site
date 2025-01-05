import { Plugin } from 'unified';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { map } from 'unist-util-map';

// Remark plugin to convert text enclosed between `$$` into code blocks.
const remarkCodeblockPlugin: Plugin = () => {
  return (tree: Node) => {
    return map(tree, (node) => {
      const { type, tagName, properties, children } = node
      if (type !== 'code') {
        return node
      }
      console.log({type, tagName})
      console.log({node})
      return node
    })
    /*
    visit(tree, 'text', (node: Node) => {
      console.log('processing node', node)
    })
    visit(tree, 'paragraph', (node: Parent) => {
      console.log('processing node', node)
      node.children = []
    })
    */
  };
};

export default remarkCodeblockPlugin;
