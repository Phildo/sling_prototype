var GamePlayScene = function(game, stage)
{
  var self = this;
  var assetter;
  var dbugger; //'debugger' is a keyword... (why.)
  var drawer;
  var ticker;
  var clicker;
  var hoverer;
  var dragger;
  var flicker;
  var presser;
  var particler;

  var doodle;

  var Doodle = function()
  {
    var self = this;

    //for listening to hover
    self.x = 0;
    self.y = 0;
    self.w = stage.dispCanv.canvas.width;
    self.h = stage.dispCanv.canvas.height;

    //last known hover
    self.hx = 0;
    self.hy = 0;

    //velocity
    self.vx = 0;
    self.vy = 0;

    //actual pos
    self.ax = 0;
    self.ay = 0;
    self.aw = 10;
    self.ah = 10;

    self.r = "FF";
    self.g = "00";
    self.b = "DD";

    var DoodlePart = function(x,y,w,h,vx,vy)
    {
      var self = this;

      self.x = x;
      self.y = y;
      self.w = w;
      self.h = h;

      self.vx = vx;
      self.vy = vy;

      self.t = 0;

      self.tick = function()
      {
        self.t++;

        self.x += self.vx;
        self.y += self.vy;

        if(
        self.x < 0 && self.vx < 0 ||
        self.x > stage.drawCanv.canvas.width && self.vx > 0
        )
        self.vx = -self.vx;

        if(
        self.y < 0 && self.vy < 0 ||
        self.y > stage.drawCanv.canvas.height && self.vy > 0
        )
        self.vy = -self.vy;

        if(self.t > 1000) return false;
        return true;
      }

      self.draw = function(canv)
      {
        canv.context.fillRect(self.x,self.y,self.w,self.h);
      }
    }

    self.click = function(evt)
    {
      var dPart = new DoodlePart(self.ax,self.ay,self.aw,self.ah,self.vx,self.vy);
      particler.register(dPart);
    }

    self.hover = function(evt)
    {
      self.hx = evt.doX;
      self.hy = evt.doY;
    }

    self.unhover = function(evt)
    {
    }

    var snap = 10;
    var damp = 0.9;
    self.tick = function()
    {
      self.vx += ((self.hx-(self.aw/2))-self.ax)/snap;
      self.vy += ((self.hy-(self.ah/2))-self.ay)/snap;

      self.vx *= damp;
      self.vy *= damp;

      self.ax += self.vx;
      self.ay += self.vy;
    }

    self.draw = function(canv)
    {
      canv.context.fillStyle = "#"+self.r+self.g+self.b;
      canv.context.fillRect(self.ax,self.ay,self.aw,self.ah);
    }
  }

  self.ready = function()
  {
    hoverer = new PersistentHoverer({source:stage.dispCanv.canvas});
    clicker = new Clicker({source:stage.dispCanv.canvas});
    particler = new Particler({});

    doodle = new Doodle();
    hoverer.register(doodle);
    clicker.register(doodle);
  };

  self.tick = function()
  {
    hoverer.flush();
    clicker.flush();
    doodle.tick();
    particler.tick();
  };

  self.draw = function()
  {
    doodle.draw(stage.drawCanv);
    particler.draw(stage.drawCanv);
  };

  self.cleanup = function()
  {
  };
};

