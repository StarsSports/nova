function serializeWorkspace() {
    const mapData = objects.map(obj => {
        return {
            name: obj.name,
            type: "Part",
            position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
            rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
            scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
            color: "#" + obj.material.color.getHexString(),
            script: obj.customScript || "" // We'll add the script editor next
        };
    });

    const finalGame = {
        metadata: {
            title: "My Nova Project",
            creator: "AYH4M",
            version: "1.0"
        },
        workspace: mapData
    };

    // This creates a downloadable JSON file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalGame, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "game_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
