const {
	getMediaByPlaylist,
	getCurrentMediaDetails,
} = require("../controllers/userController");

const router = require("express").Router();

router.get("/", (req, res) => {
	res.json({ app: "user" });
});

// router.get("/:id", (req, res) => {
// 	id = req.params.id;
// 	res.json({ id });
// });

router.get("/get-videos-by-playlist/:playlist", getMediaByPlaylist);
router.get("/get-current-media-details/:m", getCurrentMediaDetails);

module.exports = router;
