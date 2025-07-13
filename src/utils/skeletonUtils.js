import * as THREE from 'three';

export const SkeletonUtils = {

    clone: function (source) {
        const sourceLookup = new Map();
        const cloneLookup = new Map();

        const clone = source.clone();

        parallelTraverse(source, clone, function (sourceNode, clonedNode) {
            sourceLookup.set(clonedNode, sourceNode);
            cloneLookup.set(sourceNode, clonedNode);
        });

        source.traverse(function (sourceMesh) {
            if (!sourceMesh.isSkinnedMesh) return;

            const sourceBones = sourceMesh.skeleton.bones;
            const clonedMesh = cloneLookup.get(sourceMesh);
            const clonedBones = sourceBones.map(bone => cloneLookup.get(bone));
            const skeleton = new THREE.Skeleton(clonedBones);

            clonedMesh.bind(skeleton, sourceMesh.bindMatrix);
        });

        return clone;
    }

};

function parallelTraverse(a, b, callback) {
    callback(a, b);
    for (let i = 0; i < a.children.length; i++) {
        parallelTraverse(a.children[i], b.children[i], callback);
    }
}
