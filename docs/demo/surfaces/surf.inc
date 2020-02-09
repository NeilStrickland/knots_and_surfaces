<?php

$surfaces = array(
 'boys' => "Boy's surface",
 'holycube' => 'Cube with holes',
 'icos' => 'Icosahedron',
 'nonmanifold' => 'Not a surface',
 'sph' => 'Sphere',
 'strip' => 'Mobius strip',
 'tor' => 'Torus',
 'simptor' => 'Simplicial torus',
 'genus2' => 'A surface of genus two'
);

function page_head($title) {
 echo <<<HTML
<!doctype html>
<html>
 <head>
  <title>$title</title>
  <script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js">
    MathJax.Hub.Config({
      extensions: ["tex2jax.js"],
      jax: ["input/TeX","output/HTML-CSS"],
      tex2jax: {inlineMath: [["$","$"]]}
    });
  </script>
  <script type="text/javascript" src="../js/jsc3d/jsc3d.js"></script>
  <script type="text/javascript" src="../js/jsc3d/jsc3d.webgl.js"></script>
  <script type="text/javascript" src="../js/jsc3d/jsc3d.touch.js"></script>
 </head>
 <body style="width:800px;">
  <h1>$title</h1>

HTML;
}

function page_foot() {
 echo <<<HTML
 </body>
</html>

HTML;
}

function surface_div($s) {
 echo <<<HTML
  <div>
   <canvas id="$s" style="border: 1px solid;" width="600" height="600" ></canvas>
  </div>
  <script type="text/javascript">
   var canvas = document.getElementById('$s');
   var viewer = new JSC3D.Viewer(canvas);
   viewer.setParameter('SceneUrl', '$s.obj');
   viewer.setParameter('InitRotationX', 10);
   viewer.setParameter('InitRotationY', 20);
   viewer.setParameter('InitRotationZ', 30);
   viewer.setParameter('ModelColor', '#0000FF');
   viewer.setParameter('BackgroundColor1', '#FFFFFF');
   viewer.setParameter('BackgroundColor2', '#FFFFFF');
   viewer.setParameter('RenderMode', 'texturesmooth');
   viewer.setParameter('MipMapping', 'on');
   viewer.setParameter('Renderer', 'webgl');
   viewer.init();
   viewer.update();
  </script>

HTML;
}

function surface_page($s) {
 global $surfaces;

 if (isset($surfaces[$s])) {
  $t = $surfaces[$s];
 } else if (file_exists($s . '.obj')) {
  $t = $s;
 } else {
  error("File not found");
 }

 page_head($t);
 surface_div($s);

 if (file_exists($s . ".tex")) {
  $tex = file_get_contents($s . ".tex");

  echo <<<HTML
<div>
$tex
</div>

HTML;

 }

 page_foot();
}


?>
