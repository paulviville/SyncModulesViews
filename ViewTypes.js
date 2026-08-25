import ViewCore from "./ViewCore.js"
import TransformView from "./TransformView.js"
import LineView from "./LineView.js"
import PrimitiveView from "./PrimitiveView.js"
import CameraView from "./CameraView.js"
import PointsView from "./PointsView.js"
import TextLogView from "./TextLogView.js"
import TriggerView from "./TriggerView.js"
import ImageView from "./ImageView.js"
import Image360View from "./Image360View.js"
import GLTFView from "./GLTFView.js"

const ViewTypes = {
	[ ViewCore.type ]: ViewCore,
	[ TransformView.type ]: TransformView,
	[ LineView.type ]: LineView,
	[ PrimitiveView.type ]: PrimitiveView,
	[ CameraView.type ]: CameraView,
	[ PointsView.type ]: PointsView,
	[ TextLogView.type ]: TextLogView,
	[ TriggerView.type ]: TriggerView,
	[ GLTFView.type ]: GLTFView,
	[ ImageView.type ]: ImageView,
	[ Image360View.type ]: Image360View,
};

Object.freeze( ViewTypes );
export default ViewTypes;


