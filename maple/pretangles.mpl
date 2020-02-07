# Our category of pretangles is a combinatorial model for the category of 
# oriented 0-manifolds and 1-cobordisms up to diffeomorphism.  Later we
# will introduce a category of tangles, corresponding to cobordisms 
# embedded in [0,1] x R^2

# The objects of the pretangle category are finite lists with entries in
# {1,-1} (which is the set of possible orientations of a point).  A list
# of length n corresponds to a a 0-manifold with n points.

`type/pretangle_object` := 
  (A) -> type(A,list(integer)) and {op(A)} minus {1,-1} = {};

# Here are some utility functions for working with these objects

count := (A::pretangle_object) -> `+`(op(A)); # This is the signed count
abs_count := (A::pretangle_object) -> nops(A);
pos_indices := (A::pretangle_object) -> select(i->A[i] =  1,[seq(i,i=1..nops(A))]);
neg_indices := (A::pretangle_object) -> select(i->A[i] = -1,[seq(i,i=1..nops(A))]);
neg := (A::pretangle_object) -> -~ A; # This reverses all orientations

# This operation models disjoint union of 0-manifolds

join := proc(A::pretangle_object,B::pretangle_object) 
 return [op(A),op(B)]; 
end:

# A reduced pretangle on A corresponds to a nullbordism such that every 
# connected component has nonempty boundary (and so is just a closed interval).
# Combinatorially, this is encoded by a list of length n = |A| corresponding
# to a free, orientation-reversing involution on {1,...,n}, which sends each
# boundary point to the opposite end of the interval that contains it.

`type/reduced_pretangle` := proc(T,A::pretangle_object)
 local n,i,j;
 n := abs_count(A);
 if not(type(T,list(posint))) and nops(T) = n and max(op(T)) = n then
  return(false);
 fi;
 for i from 1 to n do
  j := T[i];
  if j = i or T[j] <> i or A[i] + A[j] <> 0 then
   return false;
  fi;
 od;
 return true;
end:

# An arbitrary pretangle can be encoded as a pair consisting of a reduced
# pretangle and a natural number indicating the number of circles.

`type/pretangle` := proc(Tc,A::pretangle_object)
 local T,c;
 if not(type(Tc,[list(posint),integer])) then return false; fi;
 T,c := op(Tc);
 if c < 0 then return false; fi;
 if not(type(T,reduced_pretangle(A))) then return false; fi;
 return true;
end:

# There are only finitely many reduced pretangles on a given object, and
# we can generate a list.  

all_reduced_pretangles := proc(A::pretangle_object)
 local i,n,I0,I1,I2,II,PP,P,T;
 if count(A) <> 0 then return []; fi;
 n := nops(A)/2;
 I0 := pos_indices(A);
 I1 := neg_indices(A);
 PP := NULL;
 II := combinat[permute](I1);
 for I2 in II do
  T := table();
  for i from 1 to n do 
   T[I0[i]] := I2[i];
   T[I2[i]] := I0[i];
  od;
  P := [seq(T[i],i=1..2*n)];
  PP := PP,P;
 od;
 return [PP];
end:

# A morphism from A0 to A1 is the same as a pretangle on the join of A0 (with
# reversed orientation) and A1.

`type/pretangle_morphism` := proc(T,A0::pretangle_object,A1::pretangle_object)
 local A;
 A := join(neg(A0),A1);
 return type(T,pretangle(A));
end:

# The identity morphism

pretangle_id := proc(A::pretangle_object)
 local n;
 n := nops(A);
 return [[seq(i+n,i=1..n),seq(i,i=1..n)],0];
end:

# Composition works as follows.  Suppose we have morphisms 
# (T0,c0) : A0 -> A1 and (T1,c1) : A1 -> A2, where |Ai| = ni.
# After appropriate reindexing we get involutions U0 and U1 on the set 
# {1,...,n0+n1+n2}.  One can check that the orbits of the composite 
# U = U1 o U0 are of two types.  An even number of them will be contained
# in the set {n0+1,...,n0+n1} corresponding to A1.  These pair up to give
# orbits of the dihedral group <U0,U1>, and each such orbit contributes 
# an extra circle to the glued cobordism.  The remaining U-orbits each 
# contain precisely two points in A0 u A2, and the glued cobordism joins
# these points.

pretangle_o := proc(
 A0::pretangle_object,A1::pretangle_object,A2::pretangle_object, Tc1,Tc0
)
 local n0,n1,n2,T0,T1,c0,c1,T,c,i,j,U0,U1,U,V,C,v,w;

 if not(type(Tc1,pretangle_morphism(A1,A2))) then 
  error("Invalid input: T1 is not a pretangle morphism from A1 to A2");
 fi;
 if not(type(Tc0,pretangle_morphism(A0,A1))) then 
  error("Invalid input: T0 is not a pretangle morphism from A0 to A1");
 fi;

 T0,c0 := op(Tc0);
 T1,c1 := op(Tc1);

 n0 := nops(A0);
 n1 := nops(A1);
 n2 := nops(A2);
 U1 := [seq(i,i=1..n0),seq(T1[j]+n0,j=1..n1+n2)];
 U0 := [op(T0),seq(i+n0+n1,i=1..n2)];
 U := [seq(U1[U0[i]],i=1..n0+n1+n2)];
 C := convert(U,disjcyc);
 c := c0+c1;
 V := table();
 for v in C do
  w := select(i -> (i <= n0 or i > n0+n1),v);
  w := map(i -> `if`(i > n0+n1,i-n1,i),w);
  if w = [] then
   c := c + 1/2;
  else 
   V[w[1]] := w[2];
   V[w[2]] := w[1];
  fi;
 od;

 # convert/disjcyc does not list 1-cycles so we treat these separately
 c := c + (n0 + n1 + n2 - nops(map(op,C)))/2;

 T := [seq(V[i],i=1..n0+n2)];
 return [T,c];
end:


