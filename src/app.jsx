/** @jsx React.DOM */
var React = require('react');

var UserList = React.createClass({
    render: function() {
        return <ul className='searchList'>
            { this.props.users.map(function(user) {
                return <li key={user.id}>{user.name} <span className='userId'>{user.id}</span></li>
            }) }
        </ul>;
    }
});

var TextEditBox = React.createClass({
    getInitialState: function() {
        return {
            userSearchString: '',
            linking: false,
            linkedUsers: []
        };
    },

    lastInnerElementType: function(element) {
        var wordObj = {theWord: element, isLink: false};
        if (element.indexOf('\@') === 0) {
            wordObj.theWord = element.slice(1);
            wordObj.isLink = true;
        }
        return wordObj;
    },

    handleTextChange: function(event) {
        console.log(event.which);
        var wordArray = event.target.innerHTML
            .replace('\&nbsp;', ' ')
            .replace(/<\/?[^>]+(>|$)/g, ' ')
            .split(' ');
        wordArray = wordArray.filter(function(f) {
            return (f.length > 0);
        });
        // console.log(wordArray);
        var lastElement = wordArray.slice(-1)[0];
        var lastWord = this.lastInnerElementType(lastElement);
        if (lastWord.isLink) {
            this.setState({
                userSearchString: lastWord.theWord,
                linking: lastWord.isLink
            });
        } else {
            this.setState({
                userSearchString: '',
                linking: lastWord.isLink
            });
        }
    },

    render: function() {
        var allUsers;
        if (this.state.linking) {
            var foundUsers = this.props.userList,
                searchString = this.state.userSearchString.trim().toLowerCase();

            if (searchString.length > 0) {
                foundUsers = foundUsers.filter(function(f) {
                    return f.name.toLowerCase().match( searchString );
                });
            }

            allUsers = <UserList users={foundUsers} />;
        }

        document.eventHan

        return <div className='textEditBox'>
            <div className='compositionBox'
                contentEditable='true'
                onInput={this.handleTextChange}
                onBlur={this.handleTextChange} />
            <UserList users={this.state.linkedUsers} />
            {allUsers}
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