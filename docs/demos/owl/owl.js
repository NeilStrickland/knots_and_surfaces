var owl = {};
var owl2 = {};
var owl3 = {};

// Miscellaneous functions

owl.flat = function(a) {
 var b = [];
 for (i = 0; i < a.length; i++) {
  b = b.concat(a[i]);
 }

 return b;
}

owl.standard_colour = function(i) {
 var C = [
  [255,  0,  0], [229,122,  0], [ 76,115,  0], [ 64,255, 89],
  [ 38,145,153], [  0, 41,153], [213,128,255], [230,115,161],
  [ 89,  0,  0], [ 89, 58, 22], [204,197,102], [ 51,102, 58],
  [  0,204,255], [115,130,230], [ 96, 57,115], [242,  0, 65],
  [191, 67, 48], [178,137, 89], [255,238,  0], [ 45,179, 98],
  [  0, 68,128], [ 36,  0, 89], [204,  0,163], [127, 64, 72],
  [255,162,128], [102, 82,  0], [195,255,128], [128,255,246],
  [ 77,117,153], [136,  0,204], [102,  0, 54]
 ];

 var n = C.length;
 var c = C[(i + n - 1) % n];
 c = [c[0] / 255., c[1] / 255., c[2] / 255.];
 return c;
}


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Three dimensions

owl3.basic_scene = function(engine,canvas) {
 var scene = new BABYLON.Scene(engine);
 scene.clearColor = BABYLON.Color3.White();
 
 var light = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(-1, 1, 0), scene);
 light.diffuse     = new BABYLON.Color3(0.6, 0.4, 0.4);
 light.specular    = new BABYLON.Color3(0.2, 0.5, 0.4);
 light.groundColor = new BABYLON.Color3(0.6, 0.7, 0.8);

 var camera = new BABYLON.ArcRotateCamera("camera1",  0, 1.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
 camera.attachControl(canvas, true);
 camera.wheelPrecision = 50;

 scene.camera = camera;
 return scene;
};

//////////////////////////////////////////////////////////////////////

owl3.white_scene = function(engine,canvas) {
 var scene = new BABYLON.Scene(engine);
 scene.clearColor = BABYLON.Color3.White();
 
 var light = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(-1, 1, 0), scene);
 light.diffuse     = new BABYLON.Color3(1.0, 1.0, 1.0);
 light.specular    = new BABYLON.Color3(1.0, 1.0, 1.0);
 light.groundColor = new BABYLON.Color3(1.0, 1.0, 1.0);

 var camera = new BABYLON.ArcRotateCamera("camera1",  0, 1.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
 camera.attachControl(canvas, true);
 camera.wheelPrecision = 50;

 scene.camera = camera;
 return scene;
};

//////////////////////////////////////////////////////////////////////

owl3.set_colour = function(mesh,r,g,b) {
 var mat = new BABYLON.StandardMaterial("mat", mesh.getScene());
 mat.backFaceCulling = false;
 mat.diffuseColor  = new BABYLON.Color3(r,g,b);
 mesh.material = mat;
 mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
}

//////////////////////////////////////////////////////////////////////

owl3.make_grid_with_normal = function(n,m,f,g) {
 var i,j,t,u,x,positions,indices,normals,grid;
 
 positions = [];
 indices = [];
 normals = [];
 
 for (i = 0; i <= n; i++) {
  for (j = 0; j <= m; j++) {
   t = (i * 1.)/n;
   u = (j * 1.)/m;
   x = f(t,u);
   positions.push(x[0],x[1],x[2]);
   if (g) {
    v = g(t,u);
    normals.push(v[0],v[1],v[2]);
   }
   if (i < n && j < m) {
    i1 = (i + 1);
    j1 = (j + 1);
    k0 = (m + 1) * i  + j;
    k1 = (m + 1) * i1 + j;
    k2 = (m + 1) * i  + j1;
    k3 = (m + 1) * i1 + j1;
    indices.push(k0,k1,k3,k0,k3,k2);
   }
  }
 }

 if (!g) {
  BABYLON.VertexData.ComputeNormals(positions, indices, normals);
 }
 
 var grid = new BABYLON.VertexData();
 grid.positions = positions;
 grid.normals   = normals;
 grid.indices   = indices;

 return grid;
}

owl3.make_grid = function(n,m,f) {
 return this.make_grid_with_normal(n,m,f,null);
}

//////////////////////////////////////////////////////////////////////

// Convenience method that converts argument v to an instance of
// BABYLON.Vector3, where v can be an array of length 3, or an
// object with members x, y and z, or an object with members
// 0, 1 and 2.  In particular v can itself be a BABYLON.Vector3.

owl3.vect = function(v) {
 if (Array.isArray(v)) {
  return new BABYLON.Vector3(v[0],v[1],v[2]);
 }

 if (('x' in v) && ('y' in v) && ('z' in v)) {
  return new BABYLON.Vector3(v.x,v.y,v.z);
 }

 if ((0 in v) && (1 in v) && (2 in v)) {
  return new BABYLON.Vector3(v[0],v[1],v[2]);
 }

 return new BABYLON.Vector3(0,0,0);
}

//////////////////////////////////////////////////////////////////////
// Convenience method that converts argument v to an array of
// length 3, where v can be an array of length 3, or an
// object with members x, y and z, or an object with members
// 0, 1 and 2.  In particular v can be a BABYLON.Vector3.

owl3.unvect = function(v) {
 if (Array.isArray(v)) {
  return [v[0],v[1],v[2]];
 }

 if (('x' in v) && ('y' in v) && ('z' in v)) {
  return [v.x,v.y,v.z];
 }

 if ((0 in v) && (1 in v) && (2 in v)) {
  return [v[0],v[1],v[2]];
 }

 return [0,0,0];
}

//////////////////////////////////////////////////////////////////////
// Convenience functions to convert different representations
// of colours.  The col0 function returns a, [r,g,b,alpha] list,
// the col3 function returns a BABYLON.Color3 (with r,g,b fields)
// and the col4 function returns a BABYLON.Color4 (which also
// has an alpha field).  All three functions accept any of these
// forms as argument.

owl3.col0 = function(c) {
 if (Array.isArray(c)) { return c; }

 if (('r' in c) && ('g' in c) && ('b' in c)) {
  if ('a' in c) {
   return [c.r,c.g,c.b,c.a];
  } else {
   return [c.r,c.g,c.b,1];
  }
 }

 if ((0 in c) && (1 in c) && (2 in c)) {
  if (3 in c) {
   return [c[0],c[1],c[2],c[3]];
  } else {
   return [c[0],c[1],c[2],1];
  }
 }

 return [0,0,0,0];
}

owl3.col3 = function(c) {
 var c0 = owl3.col0(c);
 return new BABYLON.Color3(c0[0],c0[1],c0[2]);
}

owl3.col4 = function(c) {
 var c0 = owl3.col0(c);
 return new BABYLON.Color4(c0[0],c0[1],c0[2],c0[3]);
}

//////////////////////////////////////////////////////////////////////
// Return a BABYLON mesh for a sphere, intended for use with small
// spheres marking points.

owl3.point = function(u,c,d,scene) {
 var col = this.col4(c);
 var mesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter : d}, scene);
 owl3.set_colour(mesh,c[0],c[1],c[2]);
 var p = this.vect(u);
 mesh.position = p;
 var q = mesh.position;
 return mesh;
}

//////////////////////////////////////////////////////////////////////
// Return a BABYLON mesh for a thin line.  Tubes can be used instead
// for thick lines.

owl3.make_line = function(u,v,c,scene) {
 var col = this.col4(c);
 var pts = [this.vect(u), this.vect(v)];
 var mesh = 
  BABYLON.MeshBuilder.CreateLines("line",
   {points : pts, colors : [col, col]}, scene);
 mesh.points = pts;
 return mesh;
}

//////////////////////////////////////////////////////////////////////
// Return a BABYLON mesh for a filled triangle.

owl3.make_triangle = function(u,v,w,c,scene) {
 var col = this.col4(c);
 var grid = new BABYLON.VertexData();
 grid.positions = owl.flat([this.unvect(u),this.unvect(v),this.unvect(w)]);
 grid.indices = [0,1,2];
 var mesh = new BABYLON.Mesh("triangle",scene);
 grid.applyToMesh(mesh);
 owl3.set_colour(mesh,c[0],c[1],c[2]);
 return mesh;
}
 
//////////////////////////////////////////////////////////////////////
// Return a BABYLON mesh for a label.  The label will have text in black on
// a small white rectangle, which will rotate automatically so that it
// always faces the camera.

owl3.make_label = function(u,t,scene) {
 var x = {};
 var u0 = owl3.vect(u);
 var n = u0.subtract(scene.camera.position);
 x.source_plane = new BABYLON.Plane(-n.x,-n.y,-n.z,0);
 x.source_plane.normalize();

 var opts = {
  sourcePlane : x.source_plane,
  updatable : true
 };

 x.label_plane = BABYLON.MeshBuilder.CreatePlane('plane_' + v.name,opts,this.scene);
 x.label_plane.position = u0;
 x.label_plane.sourcePlane = x.source_plane;
 x.plane_texture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(x.label_plane);
 x.button = BABYLON.GUI.Button.CreateSimpleButton(null, t);
 x.button.width  = 0.2;
 x.button.height = 0.2;
 x.button.color  = 'black';
 x.button.background = 'white';
 x.button.fontSize = 200;
 x.plane_texture.addControl(x.button);

 return x;
}

//////////////////////////////////////////////////////////////////////

owl3.thin_curve = {};

owl3.thin_curve.n = 48;
owl3.thin_curve.colour = new BABYLON.Color4(1,0,0,1); // red

owl3.thin_curve.make_mesh = function(scene) {
 var f,i,x,y,mat;
 var me = this;

 this.scene = scene;

 f = function(t) { return me.embedding(t); };

 this.positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  this.positions.push(y);
 }

 this.cols = Array(this.positions.length).fill(this.colour);
 this.mesh = BABYLON.MeshBuilder.CreateLines(null,
     {points : this.positions, colors : this.cols, alpha : 1, updatable : true}, scene);

}

//////////////////////////////////////////////////////////////////////

owl3.thin_line = Object.create(owl3.thin_curve);

owl3.thin_line.a = [0,0,0];
owl3.thin_line.b = [1,1,1];

owl3.thin_line.embedding = function(t) {
 return vec.add(vec.smul(1-t,this.a),vec.smul(t,this.b));
}

//////////////////////////////////////////////////////////////////////

owl3.thin_circle = Object.create(owl3.thin_curve);

owl3.thin_circle.c = [0,0,0];
owl3.thin_circle.u = [1,0,0];
owl3.thin_circle.v = [0,1,0];

owl3.thin_circle.embedding = function(t) {
 var ct = Math.cos(2 * Math.PI * t);
 var st = Math.sin(2 * Math.PI * t);
 return [this.c[0] + ct * this.u[0] + st * this.v[0],
	 this.c[1] + ct * this.u[1] + st * this.v[1],
	 this.c[2] + ct * this.u[2] + st * this.v[2]
	];
}

//////////////////////////////////////////////////////////////////////

owl3.thin_sphere_arc = Object.create(owl3.thin_curve);

owl3.thin_sphere_arc.a = [-1,0,0];
owl3.thin_sphere_arc.b = [ 1,0,0];
owl3.thin_sphere_arc.u = [ 0,1,0];
owl3.thin_sphere_arc.v = [ 1,0,0];
owl3.thin_sphere_arc.theta = Math.PI;

owl3.thin_sphere_arc.set_ends = function(a,b) {
 this.a = vec.hat(a);
 this.b = vec.hat(b);
 this.u = vec.hat(vec.add(this.b,this.a));
 this.v = vec.hat(vec.sub(this.b,this.a));
 this.theta = 2 * Math.asin(vec.dp(this.b,this.v));
};

owl3.thin_sphere_arc.embedding = function(t) {
 var phi = this.theta * (t - 0.5);
 return vec.add(vec.smul(Math.cos(phi),this.u),
		vec.smul(Math.sin(phi),this.v));
};

//////////////////////////////////////////////////////////////////////

owl3.thick_curve = {};

owl3.thick_curve.n = 48;
owl3.thick_curve.colour = new BABYLON.Color4(1,0,0,1); // red
owl3.thick_curve.radius = 0.03;

owl3.thick_curve.set_colour = function(c) {
 this.colour = owl3.col4(c);
}

//////////////////////////////////////////////////////////////////////

owl3.thick_curve.make_mesh = function(scene) {
 var f,i,x,y,mat;
 var me = this;

 this.scene = scene;

 f = function(t) { return me.embedding(t); };

 positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  positions.push(y);
 }

 this.mesh = BABYLON.MeshBuilder.CreateTube(
  this.name, {path: positions,
	      radius: this.radius,
	      cap: BABYLON.Mesh.CAP_ALL,
	      updateable: true}, scene);

 mat = new BABYLON.StandardMaterial("mat", scene);
 mat.diffuseColor  = this.colour;
 this.mesh.material = mat;
}

//////////////////////////////////////////////////////////////////////

owl3.thick_curve.update_mesh = function(scene) {
 var f,i,x,y,positions;
 var me = this;

 f = function(t) { return me.embedding(t); };

 positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  positions.push(y);
 }

 this.mesh.dispose();
 this.mesh = BABYLON.MeshBuilder.CreateTube(
  this.name, {path: positions, radius: this.radius},scene);
 mat = new BABYLON.StandardMaterial("mat", scene);
 mat.diffuseColor  = this.colour;
 this.mesh.material = mat;
}

//////////////////////////////////////////////////////////////////////

owl3.thick_line = Object.create(owl3.thick_curve);

owl3.thick_line.a = [0,0,0];
owl3.thick_line.b = [1,1,1];

owl3.thick_line.embedding = function(t) {
 return [
  (1 - t) * this.a[0] + t * this.b[0],
  (1 - t) * this.a[1] + t * this.b[1],
  (1 - t) * this.a[2] + t * this.b[2]
 ];
}

//////////////////////////////////////////////////////////////////////

owl3.thick_sphere_arc = Object.create(owl3.thick_curve);

owl3.thick_sphere_arc.r = 1;
owl3.thick_sphere_arc.a = [-1,0,0];
owl3.thick_sphere_arc.b = [ 1,0,0];
owl3.thick_sphere_arc.u = [ 0,1,0];
owl3.thick_sphere_arc.v = [ 1,0,0];
owl3.thick_sphere_arc.theta = Math.PI;

owl3.thick_sphere_arc.set_ends = function(a,b) {
 this.r = vec.nm(a);
 this.a = a;
 this.b = vec.smul(this.r,vec.hat(b));
 this.u = vec.hat(vec.add(this.b,this.a));
 this.v = vec.hat(vec.sub(this.b,this.a));
 this.theta = 2 * Math.asin(vec.dp(this.b,this.v));
};

owl3.thick_sphere_arc.embedding = function(t) {
 var phi = this.theta * (t - 0.5);
 return vec.add(vec.smul(this.r * Math.cos(phi),this.u),
		vec.smul(this.r * Math.sin(phi),this.v));
};

//////////////////////////////////////////////////////////////////////

owl3.triangle = {
 v : [[1,0,0],[0,0,1],[0,1,0]]
};

owl3.triangle.make_mesh = function(scene) {
 this.scene = scene;
 var grid = new BABYLON.VertexData();
 grid.positions = owl.flat(this.v);
 grid.indices = [0,1,2];
 this.mesh = new BABYLON.Mesh(this.name,scene);
 grid.applyToMesh(this.mesh);
}

//////////////////////////////////////////////////////////////////////

owl3.surface = {};
owl3.surface.n = 48;
owl3.surface.m = 48;
owl3.surface.colour = {r : 0.5, g : 0.5, b : 1};

owl3.surface.make_mesh = function(scene) {
 var f,g,i,j,t,u,c;
 var me = this;

 f = function(t,u) { return me.embedding(t,u); };
 if (this.normal) {
  g = function(t,u) { return me.normal(t,u); };
 } else {
  g = null;
 }

 this.scene = scene;
 this.mesh = new BABYLON.Mesh(this.name, scene);
 if (! this.normal) { this.normal = null; }
 this.grid = 
  owl3.make_grid_with_normal(this.n,this.m,f,g);

 this.grid.applyToMesh(this.mesh,true);

 if (this.colour_function) {
  this.cols = [];
  for (i = 0; i <= this.n; i++) {
   for (j = 0; j <= this.m; j++) {
    t = (i * 1.)/this.n;
    u = (j * 1.)/this.m;
    c = this.colour_function(t,u);
    this.cols.push(c[0],c[1],c[2],c[3]);
   }
  }
  this.mesh.hasVertexAlpha = true;
  this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.cols);
 } else {
  owl3.set_colour(this.mesh,this.colour.r,this.colour.g,this.colour.b);
 }
}

//////////////////////////////////////////////////////////////////////

owl3.surface.update_mesh = function() {
 var f,g;
 var me = this;

 f = function(t,u) { return me.embedding(t,u); };
 if (this.normal) {
  g = function(t,u) { return me.normal(t,u); };
 } else {
  g = null;
 }

 this.grid = owl3.make_grid_with_normal(this.n,this.m,f,g);
 this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.grid.positions);
 this.mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, this.grid.normals);
}

//////////////////////////////////////////////////////////////////////
// Standard embedding of a 3-simplex as a regular tetrahedron.

owl3.tetrahedron_embedding = function(t) {
 return [Math.sqrt(2)*(2*t[1]-t[2]-t[3])/3,
         Math.sqrt(2/3)*(t[2]-t[3]),
	 t[0]-(t[1]+t[2]+t[3])/3];
}

//////////////////////////////////////////////////////////////////////
owl3.torus = Object.create(owl3.surface);
owl3.torus.name = 'torus';
owl3.torus.R = 2;
owl3.torus.r = 1;

owl3.torus.embedding = function(t,u) {
 var tau = 2 * Math.PI;
 var cu = Math.cos(tau * u);
 var su = Math.sin(tau * u);
 var ct = Math.cos(tau * t);
 var st = Math.sin(tau * t);
 return [(this.R+this.r*cu)*ct,
	 this.r*su,
	 (this.R+this.r*cu)*st];
};

owl3.torus.normal = function(t,u) {
 var tau = 2 * Math.PI;
 var cu = Math.cos(tau * u);
 var su = Math.sin(tau * u);
 var ct = Math.cos(tau * t);
 var st = Math.sin(tau * t);
 return [cu*ct,su,cu*st];
};


//////////////////////////////////////////////////////////////////////
owl3.cylinder = Object.create(owl3.surface);
owl3.cylinder.name = 'cylinder';
owl3.cylinder.r = 2;
owl3.cylinder.h = 4;

owl3.cylinder.embedding = function(t,u) {
 return [this.r * Math.cos(2 * Math.PI * t),
	 (u - 0.5) * this.h,
	 this.r * Math.sin(2 * Math.PI * t)];
};

owl3.cylinder.normal = function(t,u) {
 return [Math.cos(2 * Math.PI * t),
	 0,
	 Math.sin(2 * Math.PI * t)];
};

//////////////////////////////////////////////////////////////////////
owl3.sphere = Object.create(owl3.surface);
owl3.sphere.name = 'sphere';
owl3.sphere.r = 3;

owl3.sphere.normal = function(t,u) {
 var cu = Math.cos(2 * Math.PI * u);
 var su = Math.sin(2 * Math.PI * u);
 var ct = Math.cos(Math.PI * t);
 var st = Math.sin(Math.PI * t);
 return [st*cu, ct, st*su];
};

owl3.sphere.embedding = function(t,u) {
 var x = this.normal(t,u);
 return [this.r * x[0], this.r * x[1], this.r * x[2]];
};

//////////////////////////////////////////////////////////////////////
owl3.mobius = Object.create(owl3.surface);
owl3.mobius.name = 'mobius';
owl3.mobius.R = 3;
owl3.mobius.r = 1;
owl3.mobius.n = 128;

owl3.mobius.embedding = function(t,u) {
 var c2 = Math.cos(2 * Math.PI * t);
 var s2 = Math.sin(2 * Math.PI * t);
 var c4 = c2 * c2 - s2 * s2;
 var s4 = 2 * c2 * s2;
 return [(this.R + this.r * u * c2) * c4,
	 this.r * u * s2,
	 (this.R + this.r * u * c2) * s4];
};

owl3.mobius_normal = function(t,u) {
 var c = Math.cos(2 * Math.PI * t);
 var s = Math.sin(2 * Math.PI * t);
 var r = this.r;
 var R = this.R;
 var n = [(8*s*t^2-4*s)*r*R+(8*s*t^3-8*s*t)*u*r^2,
	  -4*r^2*t^2*u-4*R*r*t,
	  (-8*t^3+8*t)*r*R+(-8*t^4+12*t^2-2)*u*r^2 ];
 var nn = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
 n = [- n[0] / nn, - n[1] / nn, - n[2] / nn];
 return n;
}

//////////////////////////////////////////////////////////////////////
owl3.klein = Object.create(owl3.surface);
owl3.klein.a = 0.4;
owl3.klein.b = 0.6;
owl3.klein.c = 0.3;
owl3.klein.n = 128;
owl3.klein.m = 32;

owl3.klein.embedding = function(t,u) {
 var cu = Math.cos(2 * Math.PI * u);
 var su = Math.sin(2 * Math.PI * u);
 var c1 = Math.cos(    Math.PI * t);
 var c2 = Math.cos(2 * Math.PI * t);
 var c3 = Math.cos(3 * Math.PI * t);
 var c4 = Math.cos(4 * Math.PI * t);
 var s1 = Math.sin(    Math.PI * t);
 var s2 = Math.sin(2 * Math.PI * t);
 var s3 = Math.sin(3 * Math.PI * t);
 var s4 = Math.sin(4 * Math.PI * t);

 var x = (0.1*s3+0.1*s1+0.4*c1)*su-0.5*s4+s2;
 var y = 0.2*su*s3+2.*c2+0.5;
 var z = 0.25*cu*s2+0.4*cu;
 return [-x,z,y];
}

//////////////////////////////////////////////////////////////////////
owl3.trefoil = Object.create(owl3.surface);
owl3.trefoil.R = 1;
owl3.trefoil.r = 0.1;

owl3.trefoil.frame = function(t0) {
 var t = 2 * Math.PI * t0;
 var sin = Math.sin;
 var cos = Math.cos;
 var x = [sin(t) + 2*sin(2*t),cos(t) - 2 * cos(2*t),-sin(3*t)];
 var y = [72*sin(2*t)+3*sin(8*t)-13*sin(4*t)+3*sin(7*t)-14*sin(5*t)+3*sin(t),
       3*cos(t)-3*cos(8*t)+3*cos(7*t)-72*cos(2*t)+14*cos(5*t)-13*cos(4*t),
       10*sin(6*t)-34*sin(3*t)];
 var z = [-391*cos(t)+2*cos(8*t)-29*cos(7*t)+
	  85*cos(2*t)-99*cos(5*t)+24*cos(4*t)+9*cos(10*t)-9*cos(11*t),
          -9*sin(11*t)+29*sin(7*t)+85*sin(2*t)-9*sin(10*t)+
	  2*sin(8*t)-24*sin(4*t)-99*sin(5*t)+391*sin(t),
          -570-34*cos(3*t)-94*cos(6*t)+18*cos(9*t)];
 var ny = Math.sqrt(y[0]*y[0] + y[1]*y[1] + y[2]*y[2]);
 var nz = Math.sqrt(z[0]*z[0] + z[1]*z[1] + z[2]*z[2]);
 y = [y[0]/ny, y[1]/ny, y[2]/ny];
 z = [z[0]/nz, z[1]/nz, z[2]/nz];

 return {'x' : x, 'y' : y, 'z' : z};
}

owl3.trefoil.embedding = function(t0,u0) {
 var f = this.frame(t0);

 var cu = Math.cos(2 * Math.PI * u0);
 var su = Math.sin(2 * Math.PI * u0);
 return [this.R * f.x[0] + this.r * (cu * f.y[0] + su * f.z[0]),
	 this.R * f.x[1] + this.r * (cu * f.y[1] + su * f.z[1]),
	 this.R * f.x[2] + this.r * (cu * f.y[2] + su * f.z[2])];
}

owl3.trefoil.normal = function(t0,u0) {
 var f = this.frame(t0);

 var cu = Math.cos(2 * Math.PI * u0);
 var su = Math.sin(2 * Math.PI * u0);
 return [(cu * f.y[0] + su * f.z[0]),
	 (cu * f.y[1] + su * f.z[1]),
	 (cu * f.y[2] + su * f.z[2])];
}

//////////////////////////////////////////////////////////////////////

owl3.simplex3_embedding = function(t) {
 var u0 = 0.943*t[1]-0.471*t[2]-0.471*t[3];
 var u1 = 0.816*t[2]-0.816*t[3];
 var u2 = t[0]-0.333*t[1]-0.333*t[2]-0.333*t[3];
 var u = [u0,u2,u1];
 return u;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

owl2.node = function (t) {
 return document.createElementNS('http://www.w3.org/2000/svg', t);
};

owl2.group = function () {
 return this.node('g');
};

owl2.line = function (x1, y1, x2, y2, color, thickness) {
 var n = this.node('line');
 n.setAttribute('x1', x1);
 n.setAttribute('y1', y1);
 n.setAttribute('x2', x2);
 n.setAttribute('y2', y2);
 n.setAttribute('stroke', color);
 n.setAttribute('stroke-width', thickness);
 n.setAttribute('fill', 'none');
 return n;
};

owl2.hline = function (x1, x2, y, color, thickness) {
 return this.line(x1, y, x2, y, color, thickness);
};

owl2.vline = function (x, y1, y2, color, thickness) {
 return this.line(x, y1, x, y2, color, thickness);
};

owl2.rect = function(x0,y0,w,h,color,thickness) {
 var n = this.node('rect');
 n.setAttribute('x', x0);
 n.setAttribute('y', y0);
 n.setAttribute('width', w);
 n.setAttribute('height', h);
 n.setAttribute('stroke',color);
 n.setAttribute('stroke-width', thickness);
 n.setAttribute('fill', 'none');
 return n
};

owl2.frect = function(x0,y0,w,h,color) {
 var n = this.node('rect');
 n.setAttribute('x', x0);
 n.setAttribute('y', y0);
 n.setAttribute('width', w);
 n.setAttribute('height', h);
 n.setAttribute('stroke','none');
 n.setAttribute('fill', color);
 return n
};

owl2.points_string = function(points) {
 var n,i,m,u,s,point_strings;

 point_strings = [];
 for (i in points) {
  u = points[i];
  if (Array.isArray(u)) {
   point_strings.push('' + u[0] + ',' + u[1]);
  } else {
   point_strings.push('' + u.x + ',' + u.y);   
  }
 }

 s = 'M ' + point_strings[0] + ' L ';
 for (i = 1; i < point_strings.length; i++) {
  s += point_strings[i] + ' ';
 }

 return s;
};

owl2.lines = function(points,color,thickness) {
 var n,i,m,u,s,point_strings;
 n = this.node('path');
 n.setAttribute('stroke',color);
 n.setAttribute('stroke-width',thickness);
 n.setAttribute('fill','none');

 s = this.points_string(points);
 n.setAttribute('d',s);

 return n;
};

owl2.polygon = function(points,color) {
 var n,i,m,u,s,point_strings;
 n = this.node('path');
 n.setAttribute('stroke','none');
 n.setAttribute('fill',color);

 m = points.length;
 s = this.points_string(points);
 n.setAttribute('d',s);

 return n;
};

owl2.circle = function(x0,y0,r,color,thickness) {
 var n = this.node('circle');
 n.setAttribute('cx', x0);
 n.setAttribute('cy', y0);
 n.setAttribute('r', r);
 n.setAttribute('stroke', color);
 n.setAttribute('stroke-width',thickness);
 n.setAttribute('fill', 'none');
 return n
};

owl2.disc = function(x0,y0,r,color) {
 var n = this.node('circle');
 n.setAttribute('cx', x0);
 n.setAttribute('cy', y0);
 n.setAttribute('r', r);
 n.setAttribute('stroke','none');
 n.setAttribute('fill', color);
 return n
};

owl2.text = function(s,x,y) {
 var n = this.node('text');
 n.setAttribute('text-anchor','middle');
 n.setAttribute('alignment-baseline','middle');
 n.setAttribute('font-size','24px');
 n.setAttribute('fill','black');
 n.setAttribute('x', x);
 n.setAttribute('y', y);
 n.textContent = s;
 return n; 
};

owl2.append_tspan = function(t,s) {
 var u = this.node('tspan');
 u.textContent = s;
 t.appendChild(u);
 return u;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

owl.demo = {};

owl.demo.find_ids = function(ids) {
 var i,id,ids0,x;
 
 ids0 = ['frame','main_div','main_svg','msg_div','youtube_button',
	 'main_canvas','stage_slider'];

 if (ids !== undefined) {
  ids0 = ids.concat(ids0);
 }
 
 for (i in ids0) {
  id = ids0[i];

  x = document.getElementById(id);
  if (id && x) { this[id] = x; } 
 }

 this.activate_youtube_button();
}

//////////////////////////////////////////////////////////////////////

owl.demo.activate_youtube_button = function() {
 if (! this.name) { return; }

 if (typeof youtube_keys === 'undefined') { return; }
 
 var key = youtube_keys[this.name];

 if (! key) { return; }

 var x = document.getElementById('youtube_button');
 if (! x) { return; }

 var me = this;

 x.onclick = function() { window.open('https://youtu.be/' + key); };
}

//////////////////////////////////////////////////////////////////////

owl.demo.get_offset = function( el ) {
 var _x = 0;
 var _y = 0;
 while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
  _x += el.offsetLeft - el.scrollLeft;
  _y += el.offsetTop - el.scrollTop;
  el = el.offsetParent;
 }
 return { top: _y, left: _x };
}

owl.demo.set_msg = function(s) {
 this.msg_div.innerHTML = s;
 MathJax.Hub.Queue(['Typeset',MathJax.Hub,this.msg_div]);
}
