import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';


/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
// export enum LocationConstants {
//   WAREHOUSE = "WAREHOUSE", ROOM = "ROOM", SECTION = "SECTION"
// }

export class FileNode {
  id: number;
  parentId: number;
  filename: string;
  attribute: string;
  level: number;
  children: FileNode[];

}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

@Injectable()
export class FileDatabase {

  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  parentNodeMap = new Map<FileNode, FileNode>();

  constructor() {
    this.initialize();
  }



  treeData = [
    {
      "id": 0,
      "level": 0,
      "filename": "Location",
      "attribute": "",
      "parentId": null,
      "children": [
        {
          "filename": "new item 1",
          "attribute": "",
          "children": [
            {
              "filename": "new item",
              "attribute": "",
              "children": [
                {
                  "filename": "new item",
                  "attribute": "",
                  "children": [
                    {
                      "filename": "new item",
                      "attribute": "",
                      "children": [],
                      "level": 4,
                      "parentId": 3.1,
                      "id": 4.1
                    }
                  ],
                  "level": 3,
                  "parentId": 2.1,
                  "id": 3.1
                },
                {
                  "filename": "new item",
                  "attribute": "",
                  "children": [],
                  "level": 3,
                  "parentId": 2.1,
                  "id": 3.2
                }
              ],
              "level": 2,
              "parentId": 1.1,
              "id": 2.1
            }
          ],
          "level": 1,
          "parentId": 0,
          "id": 1.1
        }
      ]
    }
  ] as FileNode[];

  initialize() {
    const data = this.treeData;
    this.dataChange.next(data);
    console.log("treeData: "+this.data);
  }

  /** Add an item Tree node */
  public insertItem(parent: FileNode, name: string) {
    if (parent.children) {
        let newNode: FileNode;
        newNode = new FileNode();
        newNode.filename = name;
        newNode.attribute = "";
        newNode.children = [];
        newNode.level = parent.level + 1;
        console.log(newNode.level);
        newNode.parentId = parent.id;
        newNode.id = newNode.level + ((parent.children.length + 1) / 10.0);


        console.log(parent.children.length);
        console.log(newNode.id);

        parent.children.push(newNode);
        this.parentNodeMap.set(newNode, parent);
    }

  }

  public removeItem(currentNode: FileNode, root: FileNode) {
    const parentNode = this.findParent(currentNode.parentId, root);
    console.log("parentNode " + JSON.stringify(parentNode))
    const index = parentNode.children.indexOf(currentNode);
    if (index !== -1) {
      parentNode.children.splice(index, 1);
      this.dataChange.next(this.data);
      this.parentNodeMap.delete(currentNode);
    }
    console.log("currentNode" + index);

  }

  updateItem(node: FileNode, name: any) {
    name = JSON.parse(name);
    node.attribute = name;
    this.dataChange.next(this.data);
  }

  public findParent(id: number, node: any): any {

    console.log("id " + id + " node" + node.id);
    if (node != undefined && node.id === id) {
      return node;
    } else {
      console.log("ELSE " + JSON.stringify(node.children));
      for (let element in node.children) {
        console.log("Recursive " + JSON.stringify(node.children[element].children));
        if (node.children[element].children != undefined && node.children[element].children.length > 0) {
          return this.findParent(id, node.children[element]);
        } else {
          continue;
        }


      }

    }


  }

}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileDatabase]
})
export class AppComponent {
  title = 'tree-add-delete';
  @ViewChild('treeSelector') tree: any;

  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  data: any;
  editNode: FileNode;

  constructor(public database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);

  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.attribute;

  private _getChildren = (node: FileNode) => node.children;
  /** Select the category so we can insert the new item. */
  addNewItem(node: FileNode) {
    this.database.insertItem(node, 'new item');
    this.tree.renderNodeChanges(this.database.data);
    this.nestedTreeControl.expand(node);

    this.renderChanges();
    this.getTree();
  }

  public remove(node: FileNode) {
    console.log("currentNode");

    this.database.removeItem(node, this.database.data[0]);
    this.renderChanges()
    this.getTree();

  }

  renderChanges() {
    let data = this.nestedDataSource.data;
    this.nestedDataSource.data = null;
    this.nestedDataSource.data = data;

  }

  getTree() {
    console.log(JSON.stringify(this.database.data));
  }

  saveFile() {
    this.data = JSON.stringify(this.database.data);
    // Convert the text to BLOB.
    const textToBLOB = new Blob([this.data], { type: 'text/plain' });
    const sFileName = 'output.txt';	   // The file to save the data.

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
  }

  openModal(editNode: FileNode) {
    $("#myModal").css({"display":"block"});
    this.editNode = editNode;
  }

  submitAttribute() {
    console.log("inside");
    $("#myModal").css({"display":"none"});
    console.log($("#Name").val());

    var children = $(".formField");
    var idArr = {};
    console.log(children.length);
    for (var i = 0; i < children.length; i++) {
      var attrForm = children[i].id;
      var attrFormValue = $("#"+children[i].id).val();
      // idArr.push(children[i].id);
      console.log("attrForm: "+attrForm+" attrFormValue: "+attrFormValue);
      idArr[attrForm] = attrFormValue;
    }
    var json = JSON.stringify(idArr);
    console.log("json: "+json);
    this.database.updateItem(this.editNode, json);

    this.tree.renderNodeChanges(this.database.data);
    this.renderChanges();
    this.getTree();

  }
}

