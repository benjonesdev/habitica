"use strict";

habitrpg
  .controller("MemberModalCtrl", ['$scope', '$rootScope', 'Members', 'Shared', '$http', 'Notification', 'Groups', 'Chat', '$controller', 'Stats',
    function($scope, $rootScope, Members, Shared, $http, Notification, Groups, Chat, $controller, Stats) {

      $controller('RootCtrl', {$scope: $scope});

      $scope.timestamp = function(timestamp){
        return moment(timestamp).format($rootScope.User.user.preferences.dateFormat.toUpperCase());
      }

      $scope.statCalc = Stats;

      // We watch Members.selectedMember because it's asynchronously set, so would be a hassle to handle updates here
      $scope.$watch( function() { return Members.selectedMember; }, function (member) {
        if(member) {
          $scope.profile = member;
        }
      });

      $scope.sendPrivateMessage = function(uuid, message){
        if (!message) return;

        Members.sendPrivateMessage(message, uuid)
          .then(function (response) {
            Notification.text(window.env.t('messageSentAlert'));
            $rootScope.User.sync();
            $scope.$close();
          });
      };

      //@TODO: We don't send subscriptions so the structure has changed in the back. Update this when we update the views.
      $scope.gift = {
        type: 'gems',
        gems: {amount:0, fromBalance:true},
        subscription: {key:''},
        message:''
      };

      $scope.sendGift = function (uuid, gift) {
        Members.transferGems(message, uuid, $scope.gift.gems.amount)
          .then(function (response) {
            Notification.text('Gift sent!')
            $rootScope.User.sync();
            $scope.$close();
          });
      };

      $scope.reportAbuse = function(reporter, message, groupId) {
        message.flags[reporter._id] = true;
        Chat.utils.flagChatMessage({gid: groupId, messageId: message.id}, undefined, function(data){
          Notification.text(window.env.t('abuseReported'));
          $scope.$close();
        });
      };

      $scope.clearFlagCount = function(message, groupId) {
        Chat.utils.clearFlagCount({gid: groupId, messageId: message.id}, undefined, function(data){
          message.flagCount = 0;
          Notification.text("Flags cleared");
          $scope.$close();
        });
      }
    }
  ]);