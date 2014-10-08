/** @jsx React.DOM */
var React = require('react');

var UserList = React.createClass({
    render: function() {
        return <ul className='searchList'>
            { this.props.users.map(function(user) {
                return <li key={user.id}><span className='userId'>{user.id}</span> - {user.name}</li>
            }) }
        </ul>;
    }
});

var TextEditBox = React.createClass({
    getInitialState: function() {
        return {
            searchString: '',
            linking: false,
            linkedUsers: []
        };
    },

    usersMatchingWord: function(theWord) {
        var searchString = theWord.trim().toLowerCase();
        var matches = this.props.userList.filter(function(f) {
            return f.name.toLowerCase().match( searchString );
        });
        return matches;
    },

    wordType: function(element) {
        var wordObj = {theWord: element, isLink: false, theUser: null};
        if (element.length > 0 && element.indexOf('\@') === 0) {
            var word = element.slice(1);
            var users = this.usersMatchingWord(word);
            wordObj.theWord = word;
            wordObj.isLink = true;
            if (users.length === 1) {
                wordObj.theUser = users[0];
            }
        }
        return wordObj;
    },

    wordsFromHTML: function(theHTML) {
        var wordArray = theHTML
            .replace('\&nbsp;', ' ')
            .replace(/<\/?[^>]+(>|$)/g, ' ')
            .replace(/(?:[\(\)\-&$#!\[\]{}\"\',\.]+(?:\s|$)|(?:^|\s)[\(\)\-&$#!\[\]{}\"\',\.]+)/g, ' ')
            .split(' ');
        return wordArray;
    },

    linkArrayFromWords: function(theWords) {
        var linkArray = theWords       
            .filter(function(f) { return (f.length > 0); }) // remove non-words
            .map(this.wordType)                             // get type for each word
            .filter(function(f) { return f.isLink; });      // remove non-links
        return linkArray;
    },

    userArrayFromLinks: function(theLinks) {
        var userArray = theLinks.map(function(f) { return f.theUser; });
        var ids = {};
        var uniqueUsers = [];
        for (var i = 0; i < userArray.length; i++) {
            if (userArray[i] && !ids[userArray[i].id]) {
                ids[userArray[i].id] = true;
                uniqueUsers.push(userArray[i]);
            }
        }
        return uniqueUsers;
    },

    handleTextChange: function(event) {
        var wordArray = this.wordsFromHTML(event.target.innerHTML);
        var linkArray = this.linkArrayFromWords(wordArray);
        console.log(linkArray);
        if (linkArray.length > 0 && !linkArray[linkArray.length-1].theUser) {
            this.setState({
                searchString: linkArray[linkArray.length-1].theWord,
                linking: true
            });
        } else {
            this.setState({
                searchString: '',
                linking: false
            });
        }
        this.setState({linkedUsers: this.userArrayFromLinks(linkArray)});
    },

    render: function() {
        var linkingUserSearch;
        if (this.state.linking) {
            var matchingUsers = this.usersMatchingWord(this.state.searchString),
            linkingUserSearch = <div className='linkingList'><UserList users={matchingUsers} /></div>;
        }

        var linkedUsers;
        if (this.state.linkedUsers.length > 0) {
            linkedUsers = <div className='linkingList'><UserList users={this.state.linkedUsers} /></div>;
        }

        return <div className='textEditBox'>
            <div className='compositionBox'
                contentEditable='true'
                onInput={this.handleTextChange}
                onBlur={this.handleTextChange} />
            {linkingUserSearch}
            {linkedUsers}
        </div>;
    }
});

var userNames = [
    {name:'Jerold Albertson', id:'1'},
    {name:'Lindsey Hanna', id:'2'},
    {name:'Jamal Martin', id:'3'},
    {name:'Colby Natale', id:'4'},
    {name:'Josh Schlick', id:'5'},
]

React.renderComponent(
    <TextEditBox userList={userNames} />,
    document.body
);