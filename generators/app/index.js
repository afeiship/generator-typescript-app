"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const { resolve } = require("path");
const remote = require("yeoman-remote");
const yoHelper = require("@jswork/yeoman-generator-helper");
const replace = require("replace-in-file");

require("@jswork/next-registry-choices");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red(
          "generator-generator-typescript-app"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "scope",
        message: "Your scope (eg: `babel` )?",
        default: "jswork"
      },
      {
        type: "list",
        name: "registry",
        message: "Your registry",
        choices: nx.RegistryChoices.gets()
      },
      {
        type: "input",
        name: "project_name",
        message: "Your project_name (eg: like this `react-button` )?",
        default: yoHelper.discoverRoot
      },
      {
        type: "input",
        name: "description",
        message: "Your description?"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      yoHelper.rewriteProps(props);
    });
  }

  install() {
    console.log('Please run install packages by yourself.');
  }

  writing() {
    const done = this.async();
    remote("afeiship", "boilerplate-typescript-app", (_, cachePath) => {
      this.fs.copy(
        glob.sync(resolve(cachePath, "{**,.*}")),
        this.destinationPath()
      );
      done();
    });
  }

  end() {
    const { scope, project_name, description, ProjectName } = this.props;
    const files = glob.sync(resolve(this.destinationPath(), "{**,.*}"));

    replace.sync({
      files,
      from: [
        /boilerplate-typescript-app-description/g,
        /boilerplate-typescript-app/g,
        /boilerplate-typescript-app/g,
        /BoilerplateTypescriptApp/g
      ],
      to: [description, project_name, scope, ProjectName]
    });
  }
};