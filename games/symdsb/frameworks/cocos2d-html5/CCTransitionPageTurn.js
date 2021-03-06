/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 *<p> A transition which peels back the bottom right hand corner of a scene<br/>
 * to transition to the scene beneath it simulating a page turn.<br/></p>
 *
 * <p>This uses a 3DAction so it's strongly recommended that depth buffering<br/>
 * is turned on in cc.director using:</p>
 *
 * <p>cc.director.setDepthBufferFormat(kDepthBuffer16);</p>
 * @class
 * @extends cc.TransitionScene
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @param {Boolean} backwards
 * @example
 * var trans = new cc.TransitionPageTurn(t, scene, backwards);
 */
cc.TransitionPageTurn = cc.TransitionScene.extend(/** @lends cc.TransitionPageTurn# */{

    /**
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     * @param {Boolean} backwards
     */
    ctor:function (t, scene, backwards) {
        cc.TransitionScene.prototype.ctor.call(this);
        this.initWithDuration(t, scene, backwards);
    },

    /**
     * @type Boolean
     */
    _back:true,
    _className:"TransitionPageTurn",

    /**
     * Creates a base transition with duration and incoming scene.<br/>
     * If back is true then the effect is reversed to appear as if the incoming<br/>
     * scene is being turned from left over the outgoing scene.
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     * @param {Boolean} backwards
     * @return {Boolean}
     */
    initWithDuration:function (t, scene, backwards) {
        // XXX: needed before [super init]
        this._back = backwards;

        if (cc.TransitionScene.prototype.initWithDuration.call(this, t, scene)) {
            // do something
        }
        return true;
    },

    /**
     * @param {cc.Size} vector
     * @return {cc.ReverseTime|cc.TransitionScene}
     */
    actionWithSize:function (vector) {
        if (this._back)
            return cc.reverseTime(cc.pageTurn3D(this._duration, vector));        // Get hold of the PageTurn3DAction
        else
            return cc.pageTurn3D(this._duration, vector);     // Get hold of the PageTurn3DAction
    },

    /**
     * custom on enter
     */
    onEnter:function () {
        cc.TransitionScene.prototype.onEnter.call(this);
        var winSize = cc.director.getWinSize();
        var x, y;
        if (winSize.width > winSize.height) {
            x = 16;
            y = 12;
        } else {
            x = 12;
            y = 16;
        }

        var action = this.actionWithSize(cc.size(x, y));

        if (!this._back) {
            this._outScene.runAction( cc.sequence(action,cc.CallFunc.create(this.finish, this),cc.StopGrid.create()));
        } else {
            // to prevent initial flicker
            this._inScene.visible = false;
            this._inScene.runAction(
                cc.sequence(cc.show(),action, cc.callFunc(this.finish, this), cc.stopGrid())
            );
        }
    },

    _sceneOrder:function () {
        this._isInSceneOnTop = this._back;
    }
});

/**
 * Creates a base transition with duration and incoming scene.<br/>
 * If back is true then the effect is reversed to appear as if the incoming<br/>
 * scene is being turned from left over the outgoing scene.
 * @deprecated since v3.0,please use new cc.TransitionPageTurn(t, scene, backwards) instead.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @param {Boolean} backwards
 * @return {cc.TransitionPageTurn}
 * @example
 * var myTransition = cc.TransitionPageTurn.create(1.5, nextScene, true)//true means backwards
 */
cc.TransitionPageTurn.create = function (t, scene, backwards) {
    return new cc.TransitionPageTurn(t, scene, backwards);
};
