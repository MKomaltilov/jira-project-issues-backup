let request = require('sync-request');
const fs = require('fs');
let config = require('./config.json');

let res = request('GET', config.jira.url + '/rest/api/2/search?jql=project%20%3D%20' + config.jira.projectKey, {
    headers: {
        'Authorization': 'Basic ' + Buffer.from(config.jira.login + ':' + config.jira.password).toString('base64'),
    },
});

let issues = JSON.parse(res.getBody());

res = request('GET', config.jira.url + '/rest/api/2/search?jql=project%20%3D%20' + config.jira.projectKey + '&maxResults=' + issues.total, {
    headers: {
        'Authorization': 'Basic ' + Buffer.from(config.jira.login + ':' + config.jira.password).toString('base64'),
    },
});

issues = JSON.parse(res.getBody());

console.log('Amount of issues: ' + issues.total);
console.log('Issues parsed: ' + issues.issues.length);

issues = issues.issues;

json = JSON.stringify(issues);
fs.writeFile('./issues/all.json', json, (err) => {
    if (!err) {
        
    }
});

for(let issue of issues) {

    res = request('GET', config.jira.url + '/rest/api/2/issue/' + issue.key, {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(config.jira.login + ':' + config.jira.password).toString('base64'),
        },
    });

    var currentIssue = JSON.parse(res.getBody());

    if(currentIssue.fields.attachment.length > 0) {
        
        var attach = request('GET', config.jira.url + '/secure/attachmentzip/' + currentIssue.id + '.zip', {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(config.jira.login + ':' + config.jira.password).toString('base64'),
            },
        });

        fs.writeFileSync('./attachments/' + issue.key + '.zip', attach.getBody(), (err) => {
            if (!err) {
                
            } else {
                console.log(err);
            }
        });
    }

    fs.writeFileSync('./issues/' + issue.key + '.json', JSON.stringify(issue), (err) => {
        if (!err) {
            
        }
    });
}
