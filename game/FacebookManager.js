function FacebookManager() {}
FacebookManager.prototype = {
	mInitialized: false,
	mLoggedIn: false,
	
	init: function(callback) {
		if (!this.mInitialized) {
			var controller = this;
			window.fbAsyncInit = function() {
				FB.init({
					appId      : '1597987460462767',
					xfbml      : true,
					version    : 'v2.4'
				});
				
				var onLogin = function(response) {
					if (response.status == 'connected') {
						this.mLoggedIn = true;
						this.onLogin();
						if (callback) callback();
					}
				}.bind(controller);
				
				FB.getLoginStatus(function(response) {
					// Check login status on load, and if the user is
					// already logged in, go directly to the welcome message.
					if (response.status == 'connected') {
						onLogin(response);
					} else {
						// Otherwise, show Login dialog first.
						FB.login(function(response) {
							onLogin(response);
						}, {scope: 'user_friends, email'});
					}
				});
				// ADD ADDITIONAL FACEBOOK CODE HERE
			};
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
			
			this.mInitialized = true;
		}
	},
	
	onLogin: function() {
		FB.api('/me?fields=first_name, last_name', function(data) {
			console.log('[FB] Logged in as '+data.first_name+' '+data.last_name+'.');
		});
	},
	
	getFriends: function(count, callback) {
		var friends = new Array();
		
		var handler = function(response) {
			if (response && !response.error) {
				for (var i=0; i<response.data.length; i++)
					friends.push(response.data[i]);
				
				console.log(response);
				
				if (friends.length < count &&
					friends.length < response.summary.total_count &&
					response.paging.next !== undefined) {
					FB.api(response.paging.next, handler);
				}
				else
					callback(friends);
				
				console.log('[FB] Fetched '+response.data.length+' more friends.');
			}
		};
		FB.api('/me/friends', handler);
	}
};
OE.Utils.defClass(FacebookManager);
