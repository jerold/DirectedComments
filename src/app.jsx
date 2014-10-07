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
        console.log(element + ' ' + element.indexOf('\@'));
        if (element.indexOf('\&nbsp;') === 0) {
            return wordObj;
        }
        if (element.indexOf('\@') === 0) {
            wordObj.theWord = element.slice(1);
            wordObj.isLink = true;
        }
        return wordObj;
    },

    handleTextChange: function(event) {
        var lastElement = event.target.innerHTML.split(' ').slice(-1)[0];
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
        console.log('Change');
        console.log(lastElement);
        console.log(lastWord);
    },

    render: function() {
        var allUsers;
        if (this.state.linking) {
            var foundUsers = this.props.userList,
                searchString = this.state.userSearchString.trim().toLowerCase();

            if (searchString.length > 0) {
                foundUsers = foundUsers.filter(function(f){
                    return f.name.toLowerCase().match( searchString );
                });
            }

            allUsers = <UserList users={foundUsers} />;
        }

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
    {name:'Colby', id:'12345'},
    {name:'Jamal', id:'23456'},
    {name:'Jerold', id:'34567'},
    {name:'Josh', id:'45678'},
    {name:'Lindsey', id:'56789'},
]

React.renderComponent(
    <TextEditBox userList={userNames} />,
    document.body
);