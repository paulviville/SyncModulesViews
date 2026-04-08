import ViewCore from "./ViewCore.js"
import TransformView from "./TransformView.js"
import LineView from "./LineView.js"
import PrimitiveView from "./PrimitiveView.js"
import CameraView from "./CameraView.js"
import PointsView from "./PointsView.js"

const ViewTypes = {
	[ ViewCore.type ]: ViewCore,
	[ TransformView.type ]: TransformView,
	[ LineView.type ]: LineView,
	[ PrimitiveView.type ]: PrimitiveView,
	[ CameraView.type ]: CameraView,
	[ PointsView.type ]: PointsView,
};

Object.freeze( ViewTypes );
export default ViewTypes;


