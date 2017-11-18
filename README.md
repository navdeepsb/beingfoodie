# BeingFoodie

BeingFoodie is a website that aggregates traditional recipes that the users can create & share. Top contributors of these recipes will be recognized as well as the most popular recipes.

Part of an academic group project for SI-539 (Design of Complex Websites), Fall 2017, [University of Michigan School of Information](https://www.si.umich.edu "UMSI"), Ann Arbor.

<br />
<br />

## I. Setting up the project
__I.1. You will need__

1. Github for Desktop
2. GoogleAppEngineLauncher
3. Python v2.7
4. Text editor (Sublime Text, Atom, Brackets, etc.)

<br />

__I.2. Adding source code to Github for Desktop for ongoing development__

1. Open Github for Desktop
2. Click on the "+" icon on the top left corner
3. Select the "Clone" tab
4. Select this repo from the list and click on the clone button
5. Choose a path where the source code should be downloaded
4. Done

As you make changes to this folder, they will be tracked by Github. __But just don't start committing awesome changes yet, please read the next section that highlights how to make changes to the code.__

<br />

__I.3. Working with PRs__

Always create __pull requests__ (PRs) whenever you introduce a change in the source code. Follow below steps to create a PR, __these steps assume that you have added the repository to Github for Desktop (above section)__:

1. Open Github for Desktop
2. Make sure this repo, __beingfoodie__ is selected in the sidebar
3. __Create your own branch from the `master` branch__ by clicking on the "branch" icon right next to the branch selector dropdown on the top
4. Give this branch any name, example: `navdeep-dev`, and make sure the "From" field is set to "master". This will create a copy of the master branch
5. Always make changes to this branch __and not the "master"__, you can confirm this by looking at the branch name in the branch selector dropdown on the top
6. __Create a PR by clicking on the "Pull Request" button on the top right__
7. Give your PR a name, example: 'Added Readme'
8. Also give your PR a description highlighting the main changes. This will be greatly helpful in making release notes.
9. Click on "Send Pull Request"
10. Done

I will receive this PR, review the changes and merge it into the "master".

<br />

__I.4 How often to submit PRs?__

You will be submitting a bunch of PRs from the same branch. __I would recommend to commit changes to your dev branch as frequently as possible__ (and don't forget to sync your changes after committing them from the Github for Desktop app) __and submit a PR only upon completing a module/functionality/feature__.

<br />

__I.5 Why are we working with PRs and not direct commits?__

The "master" is the default branch, we can refer to it as our "production" branch that will always be deployed i.e. the website will function from this sensitive pristine code found in this branch. Each developer/contributor creates their own "development" branch from the current "master" and makes changes to this development branch. Once the changes are committed to this dev branch, the developer creates a PR to merge this code into the "master" branch so it can be reflected in the deployed website. Creating branches from another ones is a common practice in the industry and is called as __forking__. This allows control on what changes are made to the production code which is always sensitive to any code-breaking changes such as exceptions or something unmitigated.

<br />
<br />

### II. Tech stack
- Backend: Python (Google App Engine)
- Database: Firebase
- Frontend: Bootstrap + jQuery
- Deployment: Google App Engine

<br />
<br />


### III. Contributors
- [Navdeep Bagga](http://www.navdeepsb.com "Navdeep's online portfolio")
- [Katherine Bruce](https://www.github.com/katbr "Katherine's Github profile")
- [Russel Peterson](https://www.github.com/coming-soon-123 "Russel's Github profile")
- [Jie-Wei Vu](https://www.github.com/coming-soon-123 "Jie-Wei's Github profile")

<br />
<br />


### IV. Author
[Navdeep Bagga](http://www.navdeepsb.com "Navdeep's online portfolio")