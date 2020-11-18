resource "aws_iam_policy" "list_bookings_policy" {
    name   = "list-bookings_policy"
    
    policy = templatefile("${path.module}/templates/dynamodb-policy.tpl", {
        action   = "dynamodb:Scan",
        resource = "${aws_dynamodb_table.bookings.arn}",
        sns_topic = ""
    })
}

